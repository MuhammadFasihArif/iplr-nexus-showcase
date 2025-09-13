#!/bin/bash

# Railway deployment script
echo "🚂 Starting Railway deployment..."

# Check if we're in Railway environment
if [ -n "$RAILWAY_ENVIRONMENT" ]; then
    echo "🚂 Running in Railway environment"
    
    # Start the appropriate service based on Railway service name
    if [ "$RAILWAY_SERVICE_NAME" = "api" ]; then
        echo "🐍 Starting Python API server..."
        python pdf_api_server.py
    else
        echo "⚛️ Starting React frontend..."
        npm run start:prod
    fi
else
    echo "🏠 Running locally - starting both services..."
    # Local development - start both services
    npm run start:prod &
    python pdf_api_server.py
fi
