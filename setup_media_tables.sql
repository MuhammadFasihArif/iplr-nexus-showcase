-- Create media_uploads table
CREATE TABLE IF NOT EXISTS media_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
    mime_type TEXT,
    file_size BIGINT,
    alt_text TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for media_uploads
CREATE POLICY "Allow public read access to media_uploads" ON media_uploads
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert media_uploads" ON media_uploads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update media_uploads" ON media_uploads
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete media_uploads" ON media_uploads
    FOR DELETE USING (true);

-- Create policies for hero_slides
CREATE POLICY "Allow public read access to hero_slides" ON hero_slides
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert hero_slides" ON hero_slides
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero_slides" ON hero_slides
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete hero_slides" ON hero_slides
    FOR DELETE USING (true);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for media bucket
CREATE POLICY "Allow public read access to media bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to upload to media bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to update media bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to delete from media bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'media');
