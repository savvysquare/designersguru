
-- ============================================================
-- GURU DESIGNERS — Complete Schema Migration
-- ============================================================

-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. user_roles table (separate from profiles as per security rules)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. is_admin() helper — SECURITY DEFINER to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 4. services table (public read, admin CRUD)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_price_usd NUMERIC(10,2) NOT NULL,
  description TEXT,
  example_scopes TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable"
  ON public.services FOR SELECT USING (true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. clients table (anonymous + admin clients)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token TEXT, -- used to identify anonymous clients
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all clients"
  ON public.clients FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Anonymous insert via edge function (service role only in practice)
CREATE POLICY "Anyone can insert a client record"
  ON public.clients FOR INSERT WITH CHECK (true);

-- 6. orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  services_summary TEXT,   -- human readable list of services
  line_items JSONB,        -- [{name, description, price}]
  subtotal_usd NUMERIC(10,2),
  discount_pct NUMERIC(5,2) DEFAULT 0,
  discount_usd NUMERIC(10,2) DEFAULT 0,
  total_usd NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','invoiced','paid','in_progress','completed','cancelled')),
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  admin_notes TEXT,
  chat_summary TEXT,       -- AI summary of discovery conversation
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with orders"
  ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Clients can read their own orders by session token match
CREATE POLICY "Clients can read own orders"
  ON public.orders FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients
      WHERE session_token = current_setting('request.headers', true)::json->>'x-session-token'
    )
  );

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT WITH CHECK (true);

-- 7. chat_messages table (for AI conversation history)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all chat messages"
  ON public.chat_messages FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Session owner can read own messages"
  ON public.chat_messages FOR SELECT
  USING (
    session_token = current_setting('request.headers', true)::json->>'x-session-token'
  );

-- 8. payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('paystack','paypal','bank_transfer','other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed','refunded')),
  transaction_reference TEXT,
  gateway_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Anyone can insert payments"
  ON public.payments FOR INSERT WITH CHECK (true);

-- 9. Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Invoice number generator
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_num INT;
  inv_num TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM public.orders WHERE invoice_number IS NOT NULL;
  inv_num := 'GD-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(seq_num::TEXT, 3, '0');
  RETURN inv_num;
END;
$$;
