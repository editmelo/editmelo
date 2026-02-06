
-- Drop the overly permissive RESTRICTIVE policies that allow ANY authenticated user to read data
DROP POLICY IF EXISTS "Only authenticated can select client_intakes" ON public.client_intakes;
DROP POLICY IF EXISTS "Only authenticated can select leads" ON public.leads;
DROP POLICY IF EXISTS "Only authenticated can select user_roles" ON public.user_roles;

-- Block anonymous users explicitly (these are RESTRICTIVE so they deny anon access)
CREATE POLICY "Block anonymous from client_intakes"
  ON public.client_intakes
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "Block anonymous from leads"
  ON public.leads
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "Block anonymous from user_roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false);
