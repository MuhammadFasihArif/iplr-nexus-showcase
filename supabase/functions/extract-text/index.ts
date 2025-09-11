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
        
        // Basic PDF text extraction - look for readable text between PDF markers
        const textMatches = textContent.match(/\((.*?)\)/g) || [];
        const cleanedText = textMatches
          .map(match => match.slice(1, -1)) // Remove parentheses
          .filter(text => text.length > 2 && /[a-zA-Z]/.test(text)) // Filter meaningful text
          .join(' ');

        if (cleanedText.length > 50) {
          extractedText = cleanedText;
        } else {
          // Fallback: extract any readable ASCII text
          extractedText = textContent
            .replace(/[^\x20-\x7E\n\r]/g, ' ') // Keep only printable ASCII + newlines
            .replace(/\s+/g, ' ') // Normalize whitespace
            .split(' ')
            .filter(word => word.length > 2 && /[a-zA-Z]/.test(word))
            .slice(0, 500) // Limit to first 500 words
            .join(' ');
        }

        if (extractedText.length < 50) {
          extractedText = `Content extracted from ${fileName}.\n\nThis PDF file appears to contain primarily images or formatted content that requires advanced OCR processing. The file has been uploaded successfully, but text extraction is limited. Consider uploading a text-based PDF or manually entering the content.`;
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