#!/bin/bash

echo "🐍 Setting up PDF text extraction tools..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Install required packages
echo "📦 Installing PDF extraction libraries..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📖 Usage:"
echo "python3 pdf_extractor.py 'path/to/your/file.pdf'"
echo ""
echo "Example:"
echo "python3 pdf_extractor.py 'Microplastic Pollution Legislative Framework, and Policy Recommendations (Pakistan) (1).pdf'"
echo ""
echo "The script will try multiple extraction methods and save the result to a .txt file"
