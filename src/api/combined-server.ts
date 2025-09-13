import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfExtractorRouter from './pdf-extractor.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔧 Environment variables:');
console.log(`PORT: ${PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Working directory: ${process.cwd()}`);

// Health check endpoint - Define early for Railway
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({
    status: 'healthy',
    service: 'IPLR Nexus Showcase - Combined Server',
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: process.uptime()
  });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', pdfExtractorRouter);

// Serve static files from the dist directory (built React app)
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));


// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Starting IPLR Nexus Showcase - Combined Server...');
  console.log(`📡 Server will be available at: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📄 PDF API: http://0.0.0.0:${PORT}/api/extract-text`);
  console.log(`🌐 Web App: http://0.0.0.0:${PORT}`);
  console.log('='.repeat(50));
  console.log('✅ Server started successfully!');
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
