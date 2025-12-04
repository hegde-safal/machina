"""OCR text extraction using Tesseract."""

import pytesseract
from pdf2image import convert_from_path
from PIL import Image


def extract_image_text(path: str) -> str:
    """
    Extract text from images using Tesseract OCR.
    
    Args:
        path: Path to the image file
        
    Returns:
        Extracted text from the image
    """
    try:
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        print(f"Error extracting image text: {e}")
        return ""


def extract_scanned_pdf(path: str) -> str:
    """
    Extract text from scanned PDFs using Tesseract OCR.
    Converts each PDF page to an image, then performs OCR.
    
    Args:
        path: Path to the PDF file
        
    Returns:
        Extracted text from all pages
    """
    try:
        pages = convert_from_path(path)
        full_text = ""

        for page in pages:
            text = pytesseract.image_to_string(page)
            full_text += text + "\n"

        return full_text
    except Exception as e:
        print(f"Error extracting scanned PDF: {e}")
        return ""
