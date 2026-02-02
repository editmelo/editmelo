-- Block anonymous SELECT on client_intakes table
CREATE POLICY "Block anonymous select on client_intakes"
ON public.client_intakes
AS RESTRICTIVE
FOR SELECT
USING (false);

-- Block anonymous SELECT on user_roles table  
CREATE POLICY "Block anonymous select on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
USING (false);

-- Force RLS for all tables to ensure it applies even to table owners
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE public.client_intakes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;