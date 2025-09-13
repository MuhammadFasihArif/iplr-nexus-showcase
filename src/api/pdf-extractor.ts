import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import pdfParse from 'pdf-parse';

const extractTextFromPDF = async (buffer: Buffer): Promise<{ text: string, pages: number }> => {
  try {
    const data = await pdfParse(buffer);

    return {
      text: data.text.trim(),
      pages: data.numpages || 1
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'PDF Text Extractor API',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for Railway health checks
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'PDF Text Extractor API',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// PDF text extraction endpoint
router.post('/extract-text', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;

    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    console.log(`Processing PDF: ${file.originalname}, size: ${file.size} bytes`);

    try {
      const result = await extractTextFromPDF(file.buffer);

      if (result.text && result.text.trim()) {
        const cleanedText = result.text.replace(/\s+/g, ' ').trim();

        console.log(`✅ Successfully extracted ${cleanedText.length} characters from PDF`);

        res.json({
          success: true,
          extractedText: cleanedText,
          fileName: file.originalname,
          textLength: cleanedText.length,
          pageCount: result.pages
        });
      } else {
        console.log('❌ No text found in PDF');
        res.json({
          success: false,
          error: 'No text could be extracted from this PDF. It may be image-based, password-protected, or corrupted.',
          fileName: file.originalname
        });
      }
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      res.json({
        success: false,
        error: `Failed to extract text from PDF: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        fileName: file.originalname
      });
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

// Base64 PDF extraction endpoint
router.post('/extract-from-base64', async (req: Request, res: Response) => {
  try {
    const { pdfData } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(pdfData, 'base64');
    } catch (error) {
      return res.status(400).json({ error: 'Invalid base64 data' });
    }

    console.log(`Processing base64 PDF, size: ${buffer.length} bytes`);

    try {
      const result = await extractTextFromPDF(buffer);

      if (result.text && result.text.trim()) {
        const cleanedText = result.text.replace(/\s+/g, ' ').trim();

        console.log(`✅ Successfully extracted ${cleanedText.length} characters from base64 PDF`);

        res.json({
          success: true,
          extractedText: cleanedText,
          textLength: cleanedText.length,
          pageCount: result.pages
        });
      } else {
        console.log('❌ No text found in base64 PDF');
        res.json({
          success: false,
          error: 'No text could be extracted from this PDF. It may be image-based, password-protected, or corrupted.'
        });
      }
    } catch (parseError) {
      console.error('Base64 PDF parsing error:', parseError);
      res.json({
        success: false,
        error: `Failed to extract text from PDF: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      });
    }
  } catch (error) {
    console.error('Error processing base64 PDF:', error);
    res.status(500).json({
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

// Instagram oEmbed endpoint for getting video thumbnails
router.get('/instagram-thumbnail', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    if (!url.includes('instagram.com')) {
      return res.status(400).json({ error: 'URL must be an Instagram link' });
    }
    
    // Extract Instagram post/reel ID
    const instagramMatch = url.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/);
    if (!instagramMatch) {
      return res.status(400).json({ error: 'Invalid Instagram URL format' });
    }
    
    const postId = instagramMatch[2];
    
    // Try to get thumbnail from Instagram's media endpoint
    try {
      const thumbnailUrl = `https://instagram.com/p/${postId}/media/?size=l`;
      
      // Verify the thumbnail exists by making a HEAD request
      const response = await fetch(thumbnailUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return res.json({ 
          success: true, 
          thumbnailUrl: thumbnailUrl,
          postId: postId
        });
      } else {
        // Fallback to a generic video thumbnail
        return res.json({ 
          success: true, 
          thumbnailUrl: '/video-placeholder.svg',
          postId: postId,
          fallback: true
        });
      }
    } catch (error) {
      // Fallback to a generic video thumbnail
      return res.json({ 
        success: true, 
        thumbnailUrl: '/video-placeholder.svg',
        postId: postId,
        fallback: true
      });
    }
    
  } catch (error) {
    console.error('Error getting Instagram thumbnail:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Instagram thumbnail'
    });
  }
});

export default router;