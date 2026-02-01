-- Drop the existing permissive INSERT policies that allow anyone to insert
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit an intake" ON public.client_intakes;

-- Create new restrictive INSERT policies that deny direct public access
-- Only service role (edge functions) can insert, not anonymous/authenticated users
CREATE POLICY "Only service role can insert leads" 
  ON public.leads 
  FOR INSERT 
  WITH CHECK (false);

CREATE POLICY "Only service role can insert intakes" 
  ON public.client_intakes 
  FOR INSERT 
  WITH CHECK (false);