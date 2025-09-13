#!/bin/bash

echo "🚀 Deploying IPLR Nexus Showcase to Railway..."
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway whoami || railway login

# Create test directory for pdf-parse workaround
echo "📁 Creating test directory for pdf-parse workaround..."
mkdir -p test/data
touch test/data/05-versions-space.pdf

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at the Railway URL shown above"
echo "📄 PDF API: [your-railway-url]/api/extract-text"
echo "🔗 Health check: [your-railway-url]/health"