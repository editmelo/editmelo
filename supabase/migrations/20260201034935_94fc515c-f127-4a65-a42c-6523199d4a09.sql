-- Fix RLS policies for leads table
-- The issue is that RESTRICTIVE policies need permissive policies to work with
-- We need to add permissive policies that grant access to admins only

-- First, drop the existing RESTRICTIVE SELECT policy
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;

-- Create a PERMISSIVE policy that allows only admins to SELECT
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also fix UPDATE policy to be permissive
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also fix DELETE policy to be permissive
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit block for anonymous users trying to SELECT
CREATE POLICY "Block anonymous select on leads"
ON public.leads
FOR SELECT
TO anon
USING (false);