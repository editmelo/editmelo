
-- Fix: RESTRICTIVE USING(false) blocks ALL users including admins.
-- Replace with policies that only block anonymous (not authenticated) users.

-- Fix client_intakes: drop broken restrictive, replace with one that allows authenticated only
DROP POLICY IF EXISTS "Block anonymous select on client_intakes" ON public.client_intakes;
CREATE POLICY "Only authenticated can select client_intakes"
ON public.client_intakes
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix user_roles: same approach
DROP POLICY IF EXISTS "Block anonymous select on user_roles" ON public.user_roles;
CREATE POLICY "Only authenticated can select user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix leads: the existing "Block anonymous select on leads" is PERMISSIVE with USING(false) which is harmless but misleading. Drop it.
DROP POLICY IF EXISTS "Block anonymous select on leads" ON public.leads;
-- Add a restrictive policy that blocks anonymous
CREATE POLICY "Only authenticated can select leads"
ON public.leads
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix storage policies: restrict to authenticated users
DROP POLICY IF EXISTS "Anyone can upload intake assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload intake assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'intake-assets');

DROP POLICY IF EXISTS "Anyone can view intake assets" ON storage.objects;
CREATE POLICY "Admins can view intake assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'intake-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
