-- Create client intake submissions table
CREATE TABLE public.client_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Section 2: Business Information
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  business_description TEXT NOT NULL,
  website_goal TEXT NOT NULL,
  desired_action TEXT NOT NULL,
  
  -- Section 3: Brand Identity
  brand_colors TEXT,
  brand_fonts TEXT,
  brand_personality TEXT,
  inspiration_websites TEXT,
  
  -- Section 4: Website Structure
  desired_pages JSONB DEFAULT '[]'::jsonb,
  
  -- Section 5: Services/Offerings
  services JSONB DEFAULT '[]'::jsonb,
  
  -- Section 7: Goals & Expectations
  success_definition TEXT,
  current_challenges TEXT,
  competitors TEXT,
  avoid_or_include TEXT,
  
  -- Contact info
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an intake
CREATE POLICY "Anyone can submit an intake"
ON public.client_intakes
FOR INSERT
WITH CHECK (true);

-- Only admins can view intakes
CREATE POLICY "Admins can view all intakes"
ON public.client_intakes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update intakes
CREATE POLICY "Admins can update intakes"
ON public.client_intakes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete intakes
CREATE POLICY "Admins can delete intakes"
ON public.client_intakes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for intake file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('intake-assets', 'intake-assets', true);

-- Storage policies for intake assets
CREATE POLICY "Anyone can upload intake assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'intake-assets');

CREATE POLICY "Anyone can view intake assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'intake-assets');

-- Admins can delete intake assets
CREATE POLICY "Admins can delete intake assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'intake-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_client_intakes_updated_at
BEFORE UPDATE ON public.client_intakes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();