-- Fix storage policies for media bucket to allow public uploads
-- Run this in your Supabase Dashboard → SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete media" ON storage.objects;

-- Create new public policies
CREATE POLICY "Public can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Public can update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Public can delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

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

-- Enable RLS on hero_slides
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_slides
DROP POLICY IF EXISTS "Public read hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Admin hero_slides access" ON hero_slides;

CREATE POLICY "Public read hero_slides" ON hero_slides
  FOR SELECT USING (true);

CREATE POLICY "Public insert hero_slides" ON hero_slides
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update hero_slides" ON hero_slides
  FOR UPDATE USING (true);

CREATE POLICY "Public delete hero_slides" ON hero_slides
  FOR DELETE USING (true);

-- Insert some default hero slides
INSERT INTO hero_slides (title, subtitle, description, image_url, order_index, is_active) VALUES
  ('Advancing Academic Excellence', 'Featured Research', 'Discover groundbreaking research and innovative methodologies that shape the future of education and professional development.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop', 1, true),
  ('Learning Without Boundaries', 'Educational Innovation', 'Explore modern learning environments and collaborative spaces that foster intellectual growth and academic achievement.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop', 2, true),
  ('Research & Innovation', 'Scientific Discovery', 'Access cutting-edge research facilities and scientific breakthroughs that drive progress in various academic disciplines.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=1080&fit=crop', 3, true)
ON CONFLICT DO NOTHING;
