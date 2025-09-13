import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [testResult, setTestResult] = useState<string>("");
  const { toast } = useToast();

  const testDatabaseConnection = async () => {
    try {
      // Test if media_uploads table exists
      const { data, error } = await supabase
        .from('media_uploads')
        .select('count')
        .limit(1);

      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`);
        return;
      }

      setTestResult("✅ Database connection successful - media_uploads table exists");
    } catch (error) {
      setTestResult(`❌ Connection Error: ${error}`);
    }
  };

  const testStorageBucket = async () => {
    try {
      // Test if media bucket exists
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 1 });

      if (error) {
        setTestResult(`❌ Storage Error: ${error.message}`);
        return;
      }

      setTestResult("✅ Storage bucket 'media' exists and is accessible");
    } catch (error) {
      setTestResult(`❌ Storage Error: ${error}`);
    }
  };

  const testUpload = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      setTestResult("🔄 Testing upload...");

      try {
        // Test upload to storage
        const fileName = `test-${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (uploadError) {
          setTestResult(`❌ Upload Error: ${uploadError.message}`);
          setIsUploading(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        // Test database insert
        const { error: dbError } = await supabase
          .from('media_uploads')
          .insert({
            filename: file.name,
            file_url: publicUrl,
            file_type: 'image',
            mime_type: file.type,
            file_size: file.size,
            alt_text: 'Test upload',
            description: 'Test upload from admin panel',
          });

        if (dbError) {
          setTestResult(`❌ Database Insert Error: ${dbError.message}`);
          setIsUploading(false);
          return;
        }

        setTestResult(`✅ Upload successful! File: ${file.name}, URL: ${publicUrl}`);
        toast({
          title: "Success",
          description: "Test upload completed successfully",
        });

      } catch (error) {
        setTestResult(`❌ Error: ${error}`);
      } finally {
        setIsUploading(false);
      }
    };

    fileInput.click();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Workshop & Training Upload Diagnostics</h3>
      
      <div className="space-y-2">
        <Button onClick={testDatabaseConnection} variant="outline">
          Test Database Connection
        </Button>
        
        <Button onClick={testStorageBucket} variant="outline">
          Test Storage Bucket
        </Button>
        
        <Button onClick={testUpload} disabled={isUploading}>
          {isUploading ? "Testing..." : "Test Upload"}
        </Button>
      </div>

      {testResult && (
        <div className="p-3 bg-muted rounded text-sm">
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default TestMediaUpload;
