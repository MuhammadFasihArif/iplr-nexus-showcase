#!/bin/bash

echo "🚂 Railway Deployment Script for IPLR Website"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚂 Ready for Railway deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Ready for Railway deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Go to https://railway.app and:"
    echo "   - Sign up with GitHub"
    echo "   - Click 'New Project'"
    echo "   - Select 'Deploy from GitHub repo'"
    echo "   - Choose your repository"
    echo "   - Railway will auto-detect your project"
    echo ""
    echo "3. Configure services:"
    echo "   - Frontend: npm run start:prod"
    echo "   - Backend: python pdf_api_server.py"
    echo ""
    echo "4. Add environment variables (see RAILWAY_DEPLOYMENT.md)"
    echo ""
    echo "5. Deploy and enjoy your live website!"
    echo ""
    echo "📖 For detailed instructions, see RAILWAY_DEPLOYMENT.md"
    echo ""
    echo "💰 Cost: Usually $2-4/month (Railway gives $5 credit free)"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
