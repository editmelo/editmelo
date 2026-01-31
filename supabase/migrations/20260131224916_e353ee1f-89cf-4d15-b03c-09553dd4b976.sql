-- Add admin_notes column for internal admin comments
ALTER TABLE public.client_intakes
ADD COLUMN admin_notes text;