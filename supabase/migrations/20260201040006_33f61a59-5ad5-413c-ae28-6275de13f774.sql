-- Make intake-assets bucket private to protect client documents
UPDATE storage.buckets 
SET public = false 
WHERE id = 'intake-assets';