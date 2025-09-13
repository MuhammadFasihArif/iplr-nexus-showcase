#!/bin/bash

echo "🚀 Starting IPLR Nexus Showcase..."

# Function to check if a port is in use
check_port() {
    lsof -iTCP:$1 -sTCP:LISTEN -nP > /dev/null 2>&1
}

# Start Node.js API server in background
echo "🔧 Starting Node.js API server..."
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use. Killing existing process..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 2
fi

npm run api:dev &
API_PID=$!

# Wait for API server to start
echo "⏳ Waiting for API server to start..."
sleep 3

# Check if API server is running
if check_port 5000; then
    echo "✅ API server is running on http://localhost:5000"
else
    echo "❌ Failed to start API server"
    kill $API_PID 2>/dev/null
    exit 1
fi

# Start React development server
echo "🌐 Starting React development server..."
if check_port 8080; then
    echo "⚠️  Port 8080 is already in use. Killing existing process..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 2
fi

npm run dev &
REACT_PID=$!

# Wait for React server to start
echo "⏳ Waiting for React server to start..."
sleep 5

# Check if React server is running
if check_port 8080; then
    echo "✅ React server is running on http://localhost:8080"
else
    echo "❌ Failed to start React server"
    kill $API_PID $REACT_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Both servers are running!"
echo "🔧 API Server: http://localhost:5000"
echo "🌐 Web Application: http://localhost:8080"
echo ""
echo "📖 Usage:"
echo "1. Go to http://localhost:8080"
echo "2. Navigate to Admin → Upload Article"
echo "3. Upload a PDF - text will be extracted automatically!"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $API_PID $REACT_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
