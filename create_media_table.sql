-- Create media_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS media_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for media_uploads
DROP POLICY IF EXISTS "Public read media_uploads" ON media_uploads;
DROP POLICY IF EXISTS "Public insert media_uploads" ON media_uploads;
DROP POLICY IF EXISTS "Public update media_uploads" ON media_uploads;
DROP POLICY IF EXISTS "Public delete media_uploads" ON media_uploads;

CREATE POLICY "Public read media_uploads" ON media_uploads
  FOR SELECT USING (true);

CREATE POLICY "Public insert media_uploads" ON media_uploads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update media_uploads" ON media_uploads
  FOR UPDATE USING (true);

CREATE POLICY "Public delete media_uploads" ON media_uploads
  FOR DELETE USING (true);
