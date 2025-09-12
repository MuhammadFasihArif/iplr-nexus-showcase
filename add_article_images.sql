-- Add image support to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

-- Update media_uploads table to support video thumbnails with external links
ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS is_thumbnail BOOLEAN DEFAULT false;
