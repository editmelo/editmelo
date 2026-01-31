-- Remove the conflicting "No public read access" policy
-- The "Admins can view all leads" policy already restricts read access to admins only
DROP POLICY IF EXISTS "No public read access" ON public.leads;