const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read Supabase config
const supabaseUrl = 'https://nnslaimpizqbgvombfbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc2xhaW1waXpxYmd2b21iZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDMwNzUsImV4cCI6MjA3Mjk3OTA3NX0.D9fw8Oqy4CRjR-9Bng5KMe7SVSfqsZ9jw59Gicb9To0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMediaTables() {
  console.log('🔧 Setting up media tables and storage...');

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./setup_media_tables.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`📝 Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.log(`⚠️  Warning: ${error.message}`);
        }
      }
    }

    console.log('✅ Media tables setup completed!');
    
    // Test the setup
    console.log('🧪 Testing setup...');
    
    // Test media_uploads table
    const { data: mediaData, error: mediaError } = await supabase
      .from('media_uploads')
      .select('count')
      .limit(1);
    
    if (mediaError) {
      console.log(`❌ Media table error: ${mediaError.message}`);
    } else {
      console.log('✅ media_uploads table is accessible');
    }

    // Test hero_slides table
    const { data: heroData, error: heroError } = await supabase
      .from('hero_slides')
      .select('count')
      .limit(1);
    
    if (heroError) {
      console.log(`❌ Hero slides table error: ${heroError.message}`);
    } else {
      console.log('✅ hero_slides table is accessible');
    }

    // Test storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('media')
      .list('', { limit: 1 });
    
    if (storageError) {
      console.log(`❌ Storage bucket error: ${storageError.message}`);
    } else {
      console.log('✅ media storage bucket is accessible');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupMediaTables();
