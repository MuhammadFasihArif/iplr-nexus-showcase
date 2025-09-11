-- Create storage policy for admin article uploads
CREATE POLICY "Admins can upload articles" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'articles');

-- Create storage policy for admin to read articles
CREATE POLICY "Admins can read articles" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'articles');

-- Create storage policy for admin to update articles
CREATE POLICY "Admins can update articles" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'articles');

-- Create storage policy for admin to delete articles
CREATE POLICY "Admins can delete articles" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'articles');