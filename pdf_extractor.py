#!/usr/bin/env python3
"""
PDF Text Extractor using Python
Run this script to extract text from your PDF file
"""

import sys
import os
from pathlib import Path

def extract_pdf_text(pdf_path):
    """Extract text from PDF using multiple methods"""
    
    # Method 1: Try PyPDF2
    try:
        import PyPDF2
        print("Trying PyPDF2...")
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            if text.strip():
                print(f"✅ PyPDF2 extracted {len(text)} characters")
                return text.strip()
            else:
                print("❌ PyPDF2 found no text")
                
    except ImportError:
        print("❌ PyPDF2 not installed")
    except Exception as e:
        print(f"❌ PyPDF2 error: {e}")
    
    # Method 2: Try pdfplumber
    try:
        import pdfplumber
        print("Trying pdfplumber...")
        
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if text.strip():
                print(f"✅ pdfplumber extracted {len(text)} characters")
                return text.strip()
            else:
                print("❌ pdfplumber found no text")
                
    except ImportError:
        print("❌ pdfplumber not installed")
    except Exception as e:
        print(f"❌ pdfplumber error: {e}")
    
    # Method 3: Try pymupdf (fitz)
    try:
        import fitz  # PyMuPDF
        print("Trying PyMuPDF...")
        
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text += page.get_text() + "\n"
        
        doc.close()
        
        if text.strip():
            print(f"✅ PyMuPDF extracted {len(text)} characters")
            return text.strip()
        else:
            print("❌ PyMuPDF found no text")
            
    except ImportError:
        print("❌ PyMuPDF not installed")
    except Exception as e:
        print(f"❌ PyMuPDF error: {e}")
    
    return None

def main():
    if len(sys.argv) != 2:
        print("Usage: python pdf_extractor.py <path_to_pdf>")
        print("Example: python pdf_extractor.py 'my_document.pdf'")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        sys.exit(1)
    
    print(f"📄 Extracting text from: {pdf_path}")
    print("=" * 50)
    
    extracted_text = extract_pdf_text(pdf_path)
    
    if extracted_text:
        print("\n" + "=" * 50)
        print("📝 EXTRACTED TEXT:")
        print("=" * 50)
        print(extracted_text[:2000] + "..." if len(extracted_text) > 2000 else extracted_text)
        print("=" * 50)
        print(f"📊 Total characters: {len(extracted_text)}")
        
        # Save to file
        output_file = f"{Path(pdf_path).stem}_extracted.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(extracted_text)
        print(f"💾 Saved to: {output_file}")
        
    else:
        print("\n❌ No text could be extracted from this PDF")
        print("This might be:")
        print("- A scanned/image-based PDF (needs OCR)")
        print("- Password protected")
        print("- Corrupted or in an unusual format")
        print("\nTry installing OCR tools:")
        print("pip install pytesseract pillow")

if __name__ == "__main__":
    main()
