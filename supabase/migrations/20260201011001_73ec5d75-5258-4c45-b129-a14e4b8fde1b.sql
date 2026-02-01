-- Add explicit denial policies for anonymous SELECT access
-- This ensures anonymous users cannot read any sensitive data

-- For leads table - deny anonymous SELECT
DROP POLICY IF EXISTS "Block anonymous select on leads" ON public.leads;
CREATE POLICY "Block anonymous select on leads"
  ON public.leads FOR SELECT
  TO anon
  USING (false);

-- For client_intakes table - deny anonymous SELECT
DROP POLICY IF EXISTS "Block anonymous select on client_intakes" ON public.client_intakes;
CREATE POLICY "Block anonymous select on client_intakes"
  ON public.client_intakes FOR SELECT
  TO anon
  USING (false);

-- For user_roles table - deny anonymous SELECT
DROP POLICY IF EXISTS "Block anonymous select on user_roles" ON public.user_roles;
CREATE POLICY "Block anonymous select on user_roles"
  ON public.user_roles FOR SELECT
  TO anon
  USING (false);