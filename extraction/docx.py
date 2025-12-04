"""DOCX document text extraction."""

import docx2txt


def extract_docx(path: str) -> str:
    """
    Extract text from DOCX files.
    
    Args:
        path: Path to the DOCX file
        
    Returns:
        Extracted text from the document
    """
    try:
        text = docx2txt.process(path)
        return text if text else ""
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""
