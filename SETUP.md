# IPLR Nexus Showcase - Setup Guide

## 🚀 Quick Start

This project now uses a **single Node.js service** for both the web application and PDF text extraction, making Railway deployment much simpler.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development servers:**
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   # Terminal 1: Start API server
   npm run api:dev
   
   # Terminal 2: Start React dev server
   npm run dev
   ```

### Access the Application

- **Web Application**: http://localhost:8080
- **API Server**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🚢 Railway Deployment

The project is now configured for single-service deployment on Railway:

1. **Build and start command:**
   ```bash
   npm start
   ```

2. **Railway will automatically:**
   - Build the React frontend
   - Start the combined server (API + static files)
   - Serve everything on the assigned port

3. **Environment Variables:**
   - `PORT` - Automatically set by Railway
   - `VITE_API_URL` - Set to your Railway domain for production

## 📄 PDF Text Extraction

The PDF text extraction is now handled entirely by Node.js using the `pdf-parse` library:

- **Endpoint**: `POST /api/extract-text`
- **File Upload**: Supports PDF files up to 10MB
- **Base64 Support**: `POST /api/extract-from-base64`

## 🏗️ Project Structure

```
src/
├── api/
│   ├── server.ts          # API server only
│   ├── combined-server.ts # Combined server for production
│   └── pdf-extractor.ts   # PDF extraction routes
├── components/            # React components
├── pages/                 # React pages
└── ...
```

## 🔧 Development vs Production

- **Development**: Separate API server (port 5000) + React dev server (port 8080)
- **Production**: Single combined server serving both API and static files

## 📝 Features

- ✅ PDF text extraction
- ✅ Article management
- ✅ Media gallery
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Single-service deployment
