#!/bin/bash

echo "🚀 Starting Railway deployment process..."

# Create test directory for pdf-parse workaround
echo "📁 Creating test directory for pdf-parse workaround..."
mkdir -p test/data
touch test/data/05-versions-space.pdf

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the React app
echo "🏗️ Building React application..."
npm run build

# Start the combined server
echo "🚀 Starting combined server..."
npm run server
