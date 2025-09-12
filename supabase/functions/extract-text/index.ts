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

    // ===== PDF HANDLING =====
    if (fileName.toLowerCase().endsWith('.pdf')) {
      console.log('Processing PDF file');
      try {
        // Try using pdf-ts which might work better
        const pdfTs = await import('https://esm.sh/pdf-ts@1.0.0');
        const data = await pdfTs.extractText(uint8Array);
        extractedText = data;

        console.log('PDF text extracted, length:', extractedText.length);

        // If no text was extracted, this is likely an image-based PDF
        if (!extractedText || extractedText.replace(/\s/g, '').length < 30) {
          console.log('PDF appears to be image-based or has no text layer');
          extractedText = `⚠️ This PDF appears to be scanned or image-based. The file has been uploaded successfully, but automatic text extraction requires OCR processing which is not currently available. Please manually enter the content or use an OCR tool to extract text first.`;
        } else {
          // Clean up the extracted text
          extractedText = extractedText
            .replace(/\s+/g, ' ')
            .replace(/(.)\1{3,}/g, '$1$1') // Remove excessive character repetition
            .trim();
        }

      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        extractedText = `⚠️ PDF processing failed for ${fileName}. The file was uploaded, but text could not be extracted. Please manually enter the content.`;
      }

    // ===== DOCX HANDLING =====
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      console.log('Processing DOCX file');
      try {
        const textContent = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);

        // Extract text nodes from DOCX XML
        const textMatches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        const cleanedText = textMatches
          .map(match => match.replace(/<[^>]*>/g, ''))
          .filter(text => text.length > 0)
          .join(' ');

        extractedText = cleanedText.length > 50
          ? cleanedText
          : `⚠️ Limited text extracted from ${fileName}. Advanced processing may be required.`;

      } catch (docxError) {
        console.error('DOCX processing error:', docxError);
        extractedText = `⚠️ Could not extract text from ${fileName}. Please try manually entering content.`;
      }

    // ===== DOC HANDLING =====
    } else if (fileName.toLowerCase().endsWith('.doc')) {
      console.log('Processing DOC file');
      extractedText = `⚠️ Legacy Word (.doc) files are not supported for automatic extraction. Please convert to .docx or manually enter the content.`;

    // ===== UNSUPPORTED =====
    } else {
      extractedText = `⚠️ Unsupported file format. Automatic extraction is only available for PDF and DOCX files.`;
    }

    console.log('Text extraction completed, length:', extractedText.length);

    return new Response(
      JSON.stringify({
        success: true,
        extractedText: extractedText.slice(0, 5000), // Limit to 5000 chars
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-text function:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error during text extraction',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});