-- Remove redundant "Block anonymous select" policies
-- These are unnecessary since admin-only SELECT policies already restrict access

DROP POLICY IF EXISTS "Block anonymous select on leads" ON public.leads;

DROP POLICY IF EXISTS "Block anonymous select on client_intakes" ON public.client_intakes;

DROP POLICY IF EXISTS "Block anonymous select on user_roles" ON public.user_roles;