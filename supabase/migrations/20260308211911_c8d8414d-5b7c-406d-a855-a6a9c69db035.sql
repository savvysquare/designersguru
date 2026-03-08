
-- Drop all existing restrictive policies on orders and recreate as permissive
DROP POLICY IF EXISTS "Admins can do everything with orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Clients can read own orders" ON public.orders;

-- Recreate as PERMISSIVE (default) so any passing policy grants access
CREATE POLICY "Admins can do everything with orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clients can read own orders"
  ON public.orders FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients
      WHERE session_token = ((current_setting('request.headers', true))::json ->> 'x-session-token')
    )
  );

-- Also fix the same issue on clients table
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can read all clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can insert a client record" ON public.clients;

CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can insert a client record"
  ON public.clients FOR INSERT
  WITH CHECK (true);

-- Fix chat_messages too
DROP POLICY IF EXISTS "Admins can read all chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Session owner can read own messages" ON public.chat_messages;

CREATE POLICY "Admins can read all chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Session owner can read own messages"
  ON public.chat_messages FOR SELECT
  USING (
    session_token = ((current_setting('request.headers', true))::json ->> 'x-session-token')
  );
