
-- ============================================================
-- FIX: All policies were RESTRICTIVE (AND logic). 
-- Drop and recreate ALL as PERMISSIVE (default OR logic).
-- ============================================================

-- ORDERS
DROP POLICY IF EXISTS "Admins can do everything with orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Clients can read own orders" ON public.orders;

CREATE POLICY "Admins can do everything with orders"
  ON public.orders AS PERMISSIVE FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can insert orders"
  ON public.orders AS PERMISSIVE FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clients can read own orders"
  ON public.orders AS PERMISSIVE FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients
      WHERE session_token = ((current_setting('request.headers', true))::json ->> 'x-session-token')
    )
  );

-- CLIENTS
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can insert a client record" ON public.clients;

CREATE POLICY "Admins can manage clients"
  ON public.clients AS PERMISSIVE FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can insert a client record"
  ON public.clients AS PERMISSIVE FOR INSERT
  WITH CHECK (true);

-- CHAT_MESSAGES
DROP POLICY IF EXISTS "Admins can read all chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Session owner can read own messages" ON public.chat_messages;

CREATE POLICY "Admins can read all chat messages"
  ON public.chat_messages AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages AS PERMISSIVE FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Session owner can read own messages"
  ON public.chat_messages AS PERMISSIVE FOR SELECT
  USING (
    session_token = ((current_setting('request.headers', true))::json ->> 'x-session-token')
  );

-- PAYMENTS
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;

CREATE POLICY "Admins can manage all payments"
  ON public.payments AS PERMISSIVE FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can insert payments"
  ON public.payments AS PERMISSIVE FOR INSERT
  WITH CHECK (true);

-- SERVICES
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;

CREATE POLICY "Admins can manage services"
  ON public.services AS PERMISSIVE FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Services are publicly readable"
  ON public.services AS PERMISSIVE FOR SELECT
  USING (true);
