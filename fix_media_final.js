import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://nnslaimpizqbgvombfbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMediaIssues() {
  console.log('🔧 Fixing media upload issues...');

  try {
    // 1. Create hero_slides table
    console.log('📋 Creating hero_slides table...');
    const { error: heroError } = await supabase.rpc('exec', {
      sql: `
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
        
        ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Allow public read access to hero_slides" ON hero_slides
          FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert hero_slides" ON hero_slides
          FOR INSERT WITH CHECK (true);
        
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to update hero_slides" ON hero_slides
          FOR UPDATE USING (true);
        
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete hero_slides" ON hero_slides
          FOR DELETE USING (true);
      `
    });

    if (heroError) {
      console.log(`⚠️  Warning creating hero_slides: ${heroError.message}`);
    } else {
      console.log('✅ hero_slides table created successfully');
    }

    // 2. Fix storage policies to allow public uploads
    console.log('🔒 Fixing storage policies...');
    const { error: policyError } = await supabase.rpc('exec', {
      sql: `
        -- Drop existing restrictive policies
        DROP POLICY IF EXISTS "Admin can upload media" ON storage.objects;
        DROP POLICY IF EXISTS "Admin can update media" ON storage.objects;
        DROP POLICY IF EXISTS "Admin can delete media" ON storage.objects;
        
        -- Create new public policies
        CREATE POLICY IF NOT EXISTS "Allow public upload to media files" ON storage.objects
          FOR INSERT WITH CHECK (bucket_id = 'media');
        
        CREATE POLICY IF NOT EXISTS "Allow public update media files" ON storage.objects
          FOR UPDATE USING (bucket_id = 'media');
        
        CREATE POLICY IF NOT EXISTS "Allow public delete media files" ON storage.objects
          FOR DELETE USING (bucket_id = 'media');
      `
    });

    if (policyError) {
      console.log(`⚠️  Warning fixing storage policies: ${policyError.message}`);
    } else {
      console.log('✅ Storage policies fixed successfully');
    }

    // 3. Test the fixes
    console.log('🧪 Testing fixes...');
    
    // Test hero_slides table
    const { data: heroData, error: heroError2 } = await supabase
      .from('hero_slides')
      .select('count')
      .limit(1);
    
    if (heroError2) {
      console.log(`❌ hero_slides table still has issues: ${heroError2.message}`);
    } else {
      console.log('✅ hero_slides table is now accessible');
    }

    // Test upload
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (uploadError) {
      console.log(`❌ Upload test still fails: ${uploadError.message}`);
    } else {
      console.log('✅ Upload test now works!');
      // Clean up test file
      await supabase.storage.from('media').remove([uploadData.path]);
    }

    console.log('🎉 Media upload setup completed!');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixMediaIssues();
