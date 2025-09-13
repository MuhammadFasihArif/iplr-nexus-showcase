#!/usr/bin/env python3
"""
PDF Text Extraction API Server
This server provides an API endpoint for PDF text extraction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
import base64
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def extract_pdf_text(pdf_data):
    """Extract text from PDF data using multiple methods"""
    
    # Method 1: Try PyPDF2
    try:
        import PyPDF2
        import io
        
        logger.info("Trying PyPDF2...")
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_data))
        text = ""
        
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n"
        
        if text.strip():
            logger.info(f"✅ PyPDF2 extracted {len(text)} characters")
            return text.strip()
        else:
            logger.info("❌ PyPDF2 found no text")
            
    except ImportError:
        logger.warning("❌ PyPDF2 not installed")
    except Exception as e:
        logger.error(f"❌ PyPDF2 error: {e}")
    
    # Method 2: Try pdfplumber
    try:
        import pdfplumber
        import io
        
        logger.info("Trying pdfplumber...")
        with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
            text = ""
            
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if text.strip():
                logger.info(f"✅ pdfplumber extracted {len(text)} characters")
                return text.strip()
            else:
                logger.info("❌ pdfplumber found no text")
                
    except ImportError:
        logger.warning("❌ pdfplumber not installed")
    except Exception as e:
        logger.error(f"❌ pdfplumber error: {e}")
    
    # Method 3: Try pymupdf (fitz)
    try:
        import fitz  # PyMuPDF
        import io
        
        logger.info("Trying PyMuPDF...")
        doc = fitz.open(stream=pdf_data, filetype="pdf")
        text = ""
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text += page.get_text() + "\n"
        
        doc.close()
        
        if text.strip():
            logger.info(f"✅ PyMuPDF extracted {len(text)} characters")
            return text.strip()
        else:
            logger.info("❌ PyMuPDF found no text")
            
    except ImportError:
        logger.warning("❌ PyMuPDF not installed")
    except Exception as e:
        logger.error(f"❌ PyMuPDF error: {e}")
    
    return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "PDF Text Extractor API"})

@app.route('/extract-text', methods=['POST'])
def extract_text():
    """Extract text from PDF file"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400
        
        # Read file data
        file_data = file.read()
        logger.info(f"Processing PDF: {file.filename}, size: {len(file_data)} bytes")
        
        # Extract text
        extracted_text = extract_pdf_text(file_data)
        
        if extracted_text:
            # Clean up the text
            cleaned_text = extracted_text.replace('\n\n', '\n').strip()
            
            return jsonify({
                "success": True,
                "extractedText": cleaned_text,
                "fileName": file.filename,
                "textLength": len(cleaned_text)
            })
        else:
            return jsonify({
                "success": False,
                "error": "No text could be extracted from this PDF. It may be image-based, password-protected, or corrupted.",
                "fileName": file.filename
            })
            
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/extract-from-base64', methods=['POST'])
def extract_from_base64():
    """Extract text from base64 encoded PDF data"""
    try:
        data = request.get_json()
        
        if not data or 'pdfData' not in data:
            return jsonify({"error": "No PDF data provided"}), 400
        
        # Decode base64 data
        try:
            pdf_data = base64.b64decode(data['pdfData'])
        except Exception as e:
            return jsonify({"error": "Invalid base64 data"}), 400
        
        logger.info(f"Processing base64 PDF, size: {len(pdf_data)} bytes")
        
        # Extract text
        extracted_text = extract_pdf_text(pdf_data)
        
        if extracted_text:
            # Clean up the text
            cleaned_text = extracted_text.replace('\n\n', '\n').strip()
            
            return jsonify({
                "success": True,
                "extractedText": cleaned_text,
                "textLength": len(cleaned_text)
            })
        else:
            return jsonify({
                "success": False,
                "error": "No text could be extracted from this PDF. It may be image-based, password-protected, or corrupted."
            })
            
    except Exception as e:
        logger.error(f"Error processing base64 PDF: {e}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Get port from environment variable (Railway) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    print("🚀 Starting PDF Text Extraction API Server...")
    print(f"📡 Server will be available at: http://0.0.0.0:{port}")
    print(f"🔗 Health check: http://0.0.0.0:{port}/health")
    print(f"📄 Extract endpoint: http://0.0.0.0:{port}/extract-text")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
