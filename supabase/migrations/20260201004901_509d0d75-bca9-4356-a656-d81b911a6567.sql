-- Fix RLS policy configuration
-- The problem: ALL policies are RESTRICTIVE. RESTRICTIVE policies with USING(false) block EVERYONE.
-- The solution: Make admin policies PERMISSIVE (grants access), remove redundant deny policies
-- (RLS denies by default when no PERMISSIVE policy matches)

-- Ensure RLS is enabled on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================
-- LEADS TABLE
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Deny anonymous access to leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Only service role can insert leads" ON public.leads;

-- Create PERMISSIVE policies for admin access (grants access when condition is true)
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Keep INSERT blocked for public (service role bypasses RLS)
CREATE POLICY "Block public insert on leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- =====================
-- CLIENT_INTAKES TABLE
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Deny anonymous access to client_intakes" ON public.client_intakes;
DROP POLICY IF EXISTS "Admins can view all intakes" ON public.client_intakes;
DROP POLICY IF EXISTS "Admins can update intakes" ON public.client_intakes;
DROP POLICY IF EXISTS "Admins can delete intakes" ON public.client_intakes;
DROP POLICY IF EXISTS "Only service role can insert intakes" ON public.client_intakes;

-- Create PERMISSIVE policies for admin access
CREATE POLICY "Admins can view all intakes"
  ON public.client_intakes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update intakes"
  ON public.client_intakes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete intakes"
  ON public.client_intakes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Keep INSERT blocked for public (service role bypasses RLS)
CREATE POLICY "Block public insert on client_intakes"
  ON public.client_intakes FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- =====================
-- USER_ROLES TABLE
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Create PERMISSIVE policies
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));