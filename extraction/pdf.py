"""PDF text extraction using pdfplumber."""

import pdfplumber


def extract_pdf_text(path: str) -> str:
    """
    Extract text from a PDF using pdfplumber.
    
    Args:
        path: Path to the PDF file
        
    Returns:
        Extracted text from the PDF
    """
    text = ""
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    
    return text
