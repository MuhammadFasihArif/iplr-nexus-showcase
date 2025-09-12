#!/bin/bash

echo "🚀 Starting both servers for PDF text extraction..."

# Function to check if a port is in use
check_port() {
    lsof -iTCP:$1 -sTCP:LISTEN -nP > /dev/null 2>&1
}

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking Python dependencies..."
python3 -c "import flask, PyPDF2, pdfplumber, fitz" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Some Python packages are missing. Installing..."
    python3 -m pip install -r requirements.txt
fi

# Start Python API server in background
echo "🐍 Starting Python PDF extraction API server..."
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use. Killing existing process..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 2
fi

python3 pdf_api_server.py &
PYTHON_PID=$!

# Wait for Python server to start
echo "⏳ Waiting for Python API server to start..."
sleep 3

# Check if Python server is running
if check_port 5000; then
    echo "✅ Python API server is running on http://localhost:5000"
else
    echo "❌ Failed to start Python API server"
    kill $PYTHON_PID 2>/dev/null
    exit 1
fi

# Start Node.js dev server
echo "🌐 Starting Node.js development server..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if check_port 8080; then
    echo "⚠️  Port 8080 is already in use. Killing existing process..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    sleep 2
fi

npm run dev &
NODE_PID=$!

# Wait for Node server to start
echo "⏳ Waiting for Node.js server to start..."
sleep 5

# Check if Node server is running
if check_port 8080; then
    echo "✅ Node.js server is running on http://localhost:8080"
else
    echo "❌ Failed to start Node.js server"
    kill $PYTHON_PID $NODE_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Both servers are running!"
echo "📄 Python PDF API: http://localhost:5000"
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
    kill $PYTHON_PID $NODE_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
