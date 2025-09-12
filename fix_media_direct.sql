-- Create hero_slides table if it doesn't exist
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to media_uploads if they don't exist
DO $$ 
BEGIN
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'media_uploads' AND column_name = 'updated_at') THEN
        ALTER TABLE media_uploads ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add NOT NULL constraints if they don't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'media_uploads' AND column_name = 'mime_type' AND is_nullable = 'YES') THEN
        ALTER TABLE media_uploads ALTER COLUMN mime_type SET NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'media_uploads' AND column_name = 'file_size' AND is_nullable = 'YES') THEN
        ALTER TABLE media_uploads ALTER COLUMN file_size SET NOT NULL DEFAULT 0;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'media_uploads' AND column_name = 'alt_text' AND is_nullable = 'YES') THEN
        ALTER TABLE media_uploads ALTER COLUMN alt_text SET NOT NULL;
    END IF;
END $$;

-- Enable RLS on hero_slides
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_slides
DROP POLICY IF EXISTS "Allow public read access to hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to insert hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to update hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated users to delete hero_slides" ON hero_slides;

CREATE POLICY "Allow public read access to hero_slides" ON hero_slides
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert hero_slides" ON hero_slides
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero_slides" ON hero_slides
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete hero_slides" ON hero_slides
  FOR DELETE USING (true);

-- Fix storage policies for media bucket (allow public access)
DROP POLICY IF EXISTS "Allow public read access to media files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to media files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update media files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete media files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete media" ON storage.objects;

CREATE POLICY "Allow public read access to media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow public upload to media files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public update media files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Allow public delete media files" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

-- Insert some default hero slides
INSERT INTO hero_slides (title, subtitle, description, image_url, order_index, is_active) VALUES
  ('Advancing Academic Excellence', 'Featured Research', 'Discover groundbreaking research and innovative methodologies that shape the future of education and professional development.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop', 1, true),
  ('Learning Without Boundaries', 'Educational Innovation', 'Explore modern learning environments and collaborative spaces that foster intellectual growth and academic achievement.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop', 2, true),
  ('Research & Innovation', 'Scientific Discovery', 'Access cutting-edge research facilities and scientific breakthroughs that drive progress in various academic disciplines.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=1080&fit=crop', 3, true)
ON CONFLICT DO NOTHING;
