import express from 'express';
import cors from 'cors';
import pdfExtractorRouter from './pdf-extractor';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', pdfExtractorRouter);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Starting PDF Text Extraction API Server...');
  console.log(`📡 Server will be available at: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`📄 Extract endpoint: http://0.0.0.0:${PORT}/api/extract-text`);
  console.log('=' * 50);
});

export default app;

