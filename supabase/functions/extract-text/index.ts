import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'File name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Downloading file:', fileName);

    // Download the file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('articles')
      .download(fileName);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File downloaded successfully, size:', fileData.size);

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let extractedText = '';

    // Check file type and extract text accordingly
    if (fileName.toLowerCase().endsWith('.pdf')) {
      console.log('Processing PDF file');
      
      // For PDF files, we'll use a simple text extraction approach
      // In a production environment, you'd use a more sophisticated PDF parser
      try {
        // Convert to string and look for text patterns
        const textContent = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        // Clean the text content by removing problematic characters
        let cleanedContent = textContent
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ') // Remove control characters
          .replace(/[^\x20-\x7E\s]/g, ' ') // Keep only printable ASCII and whitespace
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        // Extract meaningful words and sentences
        const words = cleanedContent.split(' ')
          .filter(word => word.length > 2 && /[a-zA-Z]/.test(word))
          .slice(0, 1000); // Limit to first 1000 words

        // Look for URLs and extract them separately
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = textContent.match(urlRegex) || [];
        
        // Combine cleaned text with URLs
        extractedText = words.join(' ');
        
        if (urls.length > 0) {
          extractedText += '\n\nReferences/URLs found:\n' + urls.slice(0, 10).join('\n');
        }

        // If we still don't have enough meaningful content, try alternative extraction
        if (extractedText.length < 100) {
          // Look for text between parentheses (common PDF pattern)
          const textMatches = textContent.match(/\(([^)]+)\)/g) || [];
          const parenthesesText = textMatches
            .map(match => match.slice(1, -1)) // Remove parentheses
            .filter(text => text.length > 3 && /[a-zA-Z]/.test(text))
            .join(' ');

          if (parenthesesText.length > extractedText.length) {
            extractedText = parenthesesText;
          }
        }

        // Final fallback with better error message
        if (extractedText.length < 50) {
          extractedText = `Content extracted from ${fileName}.\n\nThis PDF appears to contain primarily formatted content, images, or complex layouts that require specialized OCR processing. The file has been uploaded successfully, but automatic text extraction is limited. Please consider:\n\n1. Uploading a text-based PDF\n2. Manually entering the content\n3. Using OCR software to extract text first`;
        }

      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        extractedText = `Content extracted from ${fileName}.\n\nPDF processing encountered an issue. The file has been uploaded successfully, but automatic text extraction failed. Please consider manually entering the content or ensuring the PDF contains selectable text.`;
      }

    } else if (fileName.toLowerCase().endsWith('.docx')) {
      console.log('Processing DOCX file');
      
      // Basic DOCX text extraction
      try {
        const textContent = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        // Look for text content in DOCX XML structure
        const textMatches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        const cleanedText = textMatches
          .map(match => match.replace(/<[^>]*>/g, '')) // Remove XML tags
          .filter(text => text.length > 0)
          .join(' ');

        extractedText = cleanedText.length > 50 ? cleanedText : 
          `Content extracted from ${fileName}.\n\nThis Word document requires advanced processing. The file has been uploaded successfully, but text extraction is limited. Please consider manually entering the content.`;

      } catch (docxError) {
        console.error('DOCX processing error:', docxError);
        extractedText = `Content extracted from ${fileName}.\n\nWord document processing encountered an issue. The file has been uploaded successfully, but automatic text extraction failed. Please manually enter the content.`;
      }

    } else if (fileName.toLowerCase().endsWith('.doc')) {
      console.log('Processing DOC file');
      extractedText = `Content extracted from ${fileName}.\n\nLegacy Word (.doc) files require specialized processing. The file has been uploaded successfully, but automatic text extraction is not available for this format. Please consider converting to .docx or manually entering the content.`;
    } else {
      extractedText = `Content extracted from ${fileName}.\n\nUnsupported file format for text extraction. The file has been uploaded successfully, but automatic text extraction is only available for PDF and Word documents.`;
    }

    console.log('Text extraction completed, length:', extractedText.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedText: extractedText.slice(0, 5000) // Limit to 5000 characters
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in extract-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during text extraction',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});