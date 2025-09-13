#!/bin/bash

echo "🚀 IPLR Website Deployment Script"
echo "================================="

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
    echo "🌐 Ready for deployment to Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Go to https://vercel.com and:"
    echo "   - Sign in with GitHub"
    echo "   - Click 'New Project'"
    echo "   - Import your repository"
    echo "   - Configure as Vite project"
    echo "   - Add environment variables (see DEPLOYMENT.md)"
    echo "   - Deploy!"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
