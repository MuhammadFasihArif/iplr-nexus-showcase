-- Setup test data for featured articles and video thumbnails
-- Run this in Supabase Dashboard SQL Editor after running the main schema update

-- First, let's make sure we have some enhanced articles
-- Update existing articles to have featured images (if any exist)
UPDATE articles 
SET featured_image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    featured_image_alt = 'Research and Innovation'
WHERE id IN (
  SELECT id FROM articles LIMIT 2
);

-- If no articles exist, create some sample enhanced articles
INSERT INTO articles (title, content, author, category, featured, featured_image_url, featured_image_alt)
SELECT 
  'Revolutionary Brain-Computer Interface Technology',
  'This comprehensive research explores the latest developments in brain-computer interface technology and its applications in educational environments. The study demonstrates how neural interfaces can enhance learning experiences and improve cognitive performance in academic settings. The research methodology involved extensive testing with students across various age groups and educational backgrounds. Results showed significant improvements in learning retention and engagement when using brain-computer interface technologies. The study also examined the ethical implications and privacy concerns associated with neural data collection in educational settings.',
  'Dr. Sarah Chen',
  'Educational Technology',
  false,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'Brain-Computer Interface Research'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Revolutionary Brain-Computer Interface Technology');

INSERT INTO articles (title, content, author, category, featured, featured_image_url, featured_image_alt)
SELECT 
  'Sustainable Learning Environments',
  'An in-depth analysis of sustainable practices in modern educational institutions. This research examines green campus initiatives, eco-friendly learning spaces, and their impact on student performance and environmental consciousness. The study analyzed over 50 educational institutions worldwide, measuring energy consumption, waste reduction, and student satisfaction levels. Key findings include a 30% reduction in energy costs and improved student well-being in sustainable learning environments. The research also provides practical guidelines for implementing green initiatives in educational settings.',
  'Prof. Michael Johnson',
  'Sustainability',
  false,
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'Sustainable Learning Environment'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Sustainable Learning Environments');

INSERT INTO articles (title, content, author, category, featured, featured_image_url, featured_image_alt)
SELECT 
  'Digital Transformation in Education',
  'Exploring the role of digital technologies in transforming traditional educational models. This study investigates the benefits and challenges of implementing digital learning platforms and their effectiveness in improving educational outcomes. The research involved a comprehensive analysis of digital transformation initiatives across 100+ educational institutions. Key findings reveal that institutions with robust digital infrastructure show 40% higher student engagement and 25% better learning outcomes. The study also examines the challenges of digital equity and provides recommendations for successful digital transformation strategies.',
  'Dr. Amanda Rodriguez',
  'Digital Learning',
  false,
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  'Digital Education Technology'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Digital Transformation in Education');

-- Add some research articles (non-featured)
INSERT INTO articles (title, content, author, category, featured, featured_image_url, featured_image_alt)
SELECT 
  'Neuroscience Research in Learning',
  'A comprehensive study on how neuroscience research can inform educational practices. This research examines brain-based learning strategies and their implementation in modern classrooms.',
  'Dr. James Park',
  'Neuroscience Research',
  false,
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  'Neuroscience Research Lab'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Neuroscience Research in Learning');

INSERT INTO articles (title, content, author, category, featured, featured_image_url, featured_image_alt)
SELECT 
  'Marine Biology Study Analysis',
  'An in-depth analysis of marine biology research and its applications in environmental education. This study explores underwater research facilities and their educational potential.',
  'Dr. Vladimir Petrov',
  'Marine Science Research',
  false,
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
  'Marine Biology Research'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title = 'Marine Biology Study Analysis');

-- Create some sample video thumbnails with external links
INSERT INTO media_uploads (filename, file_url, file_type, mime_type, file_size, alt_text, description, external_url, is_thumbnail)
SELECT 
  'educational-video-1.jpg',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'video_thumbnail',
  'image/jpeg',
  50000,
  'Educational Video: Learning Innovation',
  'Watch our latest video on innovative learning methodologies and their impact on student success.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  true
WHERE NOT EXISTS (SELECT 1 FROM media_uploads WHERE filename = 'educational-video-1.jpg');

INSERT INTO media_uploads (filename, file_url, file_type, mime_type, file_size, alt_text, description, external_url, is_thumbnail)
SELECT 
  'research-presentation.jpg',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  'video_thumbnail',
  'image/jpeg',
  45000,
  'Research Presentation: Future of Education',
  'Join our research team as they present groundbreaking findings on the future of educational technology.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  true
WHERE NOT EXISTS (SELECT 1 FROM media_uploads WHERE filename = 'research-presentation.jpg');

INSERT INTO media_uploads (filename, file_url, file_type, mime_type, file_size, alt_text, description, external_url, is_thumbnail)
SELECT 
  'sustainability-video.jpg',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'video_thumbnail',
  'image/jpeg',
  48000,
  'Sustainability in Education',
  'Learn about sustainable practices in educational institutions and their positive impact on the environment.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  true
WHERE NOT EXISTS (SELECT 1 FROM media_uploads WHERE filename = 'sustainability-video.jpg');

-- Show what we've created
SELECT 'Featured Articles:' as info;
SELECT id, title, author, category, featured, featured_image_url IS NOT NULL as has_image 
FROM articles 
WHERE featured = true 
ORDER BY created_at DESC;

SELECT 'Video Thumbnails:' as info;
SELECT id, filename, alt_text, external_url IS NOT NULL as has_external_link 
FROM media_uploads 
WHERE file_type = 'video_thumbnail' 
ORDER BY created_at DESC;
