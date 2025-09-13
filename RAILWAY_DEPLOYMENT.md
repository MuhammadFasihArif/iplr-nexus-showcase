# 🚀 Railway Deployment Guide

## Single-Service Deployment (No Python!)

Your IPLR Nexus Showcase is now configured for **single-service Railway deployment** with everything running on Node.js.

## 🎯 What's Included

- ✅ **React Frontend** - Built and served statically
- ✅ **Node.js API** - PDF extraction and Instagram thumbnails
- ✅ **Combined Server** - Serves both frontend and API
- ✅ **No Python Dependencies** - Pure Node.js deployment

## 🚀 Quick Deploy

### Option 1: Using Railway CLI
```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy (from project root)
railway up
```

### Option 2: Using the Deploy Script
```bash
# Make script executable and run
chmod +x deploy-railway.sh
./deploy-railway.sh
```

### Option 3: GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Railway will auto-deploy on every push

## 📋 Railway Configuration

The project includes `railway.json` with:
- **Builder**: NIXPACKS (auto-detects Node.js)
- **Start Command**: `npm run server`
- **Health Check**: `/health`
- **Restart Policy**: ON_FAILURE with 10 retries

## 🔧 Environment Variables

Set these in Railway dashboard:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `PORT` - Railway sets this automatically

## 📡 API Endpoints

After deployment, your app will have:
- **Frontend**: `https://your-app.railway.app/`
- **Health Check**: `https://your-app.railway.app/health`
- **PDF API**: `https://your-app.railway.app/api/extract-text`
- **Instagram API**: `https://your-app.railway.app/api/instagram-thumbnail`

## 🎉 That's It!

No Python, no complex setup, no hanky panky - just one clean Node.js service that does everything!