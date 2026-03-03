
-- Allow admins (and users) to read their own role
CREATE POLICY "Users can read their own role"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());
