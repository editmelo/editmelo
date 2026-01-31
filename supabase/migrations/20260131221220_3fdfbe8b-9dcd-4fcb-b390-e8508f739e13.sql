-- Add columns for file uploads
ALTER TABLE public.client_intakes
ADD COLUMN logo_files JSONB DEFAULT '[]'::jsonb,
ADD COLUMN brand_assets JSONB DEFAULT '[]'::jsonb;