-- Add explicit policy to deny anonymous SELECT access to leads table
CREATE POLICY "Deny anonymous access to leads"
  ON public.leads 
  FOR SELECT
  TO anon
  USING (false);

-- Add explicit policy to deny anonymous SELECT access to client_intakes table
CREATE POLICY "Deny anonymous access to client_intakes"
  ON public.client_intakes 
  FOR SELECT
  TO anon
  USING (false);