-- Create admin users table for simple admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow access to admin users (will be managed via specific functions)
CREATE POLICY "Admin access only" ON public.admin_users FOR ALL TO authenticated USING (false);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  file_url TEXT, -- For original PDF/Word files
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Public read access" ON public.articles FOR SELECT USING (published = true);

-- Allow admin full access (will be handled by admin functions)
CREATE POLICY "Admin full access" ON public.articles FOR ALL TO authenticated USING (false);

-- Create media uploads table
CREATE TABLE public.media_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video_link'
  mime_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read media" ON public.media_uploads FOR SELECT USING (true);

-- Allow admin full access (will be handled by admin functions)
CREATE POLICY "Admin media access" ON public.media_uploads FOR ALL TO authenticated USING (false);

-- Create hero_slides table for managing hero carousel slides
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read access to hero_slides
CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT USING (true);

-- Allow admin full access (will be handled by admin functions)
CREATE POLICY "Admin hero_slides access" ON public.hero_slides FOR ALL TO authenticated USING (false);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for articles bucket (admin only)
CREATE POLICY "Admin can upload articles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'articles' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admin can view articles" ON storage.objects FOR SELECT USING (bucket_id = 'articles' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admin can update articles" ON storage.objects FOR UPDATE USING (bucket_id = 'articles' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admin can delete articles" ON storage.objects FOR DELETE USING (bucket_id = 'articles' AND auth.uid() IS NOT NULL);

-- Storage policies for media bucket (public access for easier admin use)
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Public can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Public can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Public can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');

-- Function to create default admin user
CREATE OR REPLACE FUNCTION public.create_default_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (username, password_hash)
  VALUES ('admin', '$2b$10$rOvJmF8TvQN7jVF1xQrJKe6KvU5LrJsZJmJzZm9jHgY5QXRFmF8Iq') -- hash for 'admin'
  ON CONFLICT (username) DO NOTHING;
END;
$$;

-- Execute function to create default admin
SELECT public.create_default_admin();

-- Create function to check admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  input_username TEXT,
  input_password TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
  stored_hash TEXT;
BEGIN
  SELECT id, password_hash INTO admin_id, stored_hash
  FROM public.admin_users
  WHERE username = input_username;
  
  IF admin_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- In a real app, you'd use proper password hashing
  -- For now, we'll do simple comparison (hash of 'admin' = '$2b$10$rOvJmF8TvQN7jVF1xQrJKe6KvU5LrJsZJmJzZm9jHgY5QXRFmF8Iq')
  IF stored_hash = '$2b$10$rOvJmF8TvQN7jVF1xQrJKe6KvU5LrJsZJmJzZm9jHgY5QXRFmF8Iq' AND input_password = 'admin' THEN
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();