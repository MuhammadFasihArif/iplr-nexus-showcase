import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://nnslaimpizqbgvombfbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMediaSetup() {
  console.log('🧪 Testing media upload setup...');

  try {
    // Test 1: Check if media_uploads table exists
    console.log('📋 Testing media_uploads table...');
    const { data: mediaData, error: mediaError } = await supabase
      .from('media_uploads')
      .select('count')
      .limit(1);
    
    if (mediaError) {
      console.log(`❌ media_uploads table error: ${mediaError.message}`);
      console.log('💡 The table might not exist. You need to run the SQL migration.');
    } else {
      console.log('✅ media_uploads table is accessible');
    }

    // Test 2: Check if hero_slides table exists
    console.log('📋 Testing hero_slides table...');
    const { data: heroData, error: heroError } = await supabase
      .from('hero_slides')
      .select('count')
      .limit(1);
    
    if (heroError) {
      console.log(`❌ hero_slides table error: ${heroError.message}`);
      console.log('💡 The table might not exist. You need to run the SQL migration.');
    } else {
      console.log('✅ hero_slides table is accessible');
    }

    // Test 3: Check if media storage bucket exists
    console.log('📦 Testing media storage bucket...');
    const { data: storageData, error: storageError } = await supabase.storage
      .from('media')
      .list('', { limit: 1 });
    
    if (storageError) {
      console.log(`❌ media storage bucket error: ${storageError.message}`);
      console.log('💡 The bucket might not exist. You need to create it in Supabase dashboard.');
    } else {
      console.log('✅ media storage bucket is accessible');
    }

    // Test 4: Try a simple upload test
    console.log('📤 Testing file upload...');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (uploadError) {
      console.log(`❌ Upload test failed: ${uploadError.message}`);
    } else {
      console.log('✅ Upload test successful');
      // Clean up test file
      await supabase.storage.from('media').remove([uploadData.path]);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMediaSetup();
