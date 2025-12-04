import os
from .pdf import extract_pdf_text
from .docx import extract_docx
from .ocr import extract_image_text, extract_scanned_pdf
# from cleaning.text_cleaner import clean_text


def extract_any(path: str) -> str:
    ext = path.lower().split(".")[-1]

    # ---- DOCX ----
    if ext == "docx":
        text = extract_docx(path)
        return (text)

    # ---- IMAGES (jpg, png, jpeg) ----
    if ext in ["jpg", "jpeg", "png"]:
        text = extract_image_text(path)
        return (text)

    # ---- PDF ----
    if ext == "pdf":
        # Try digital text extraction first
        text = extract_pdf_text(path)

        # If nothing extracted → treat as scanned PDF
        if len(text.strip()) < 10:
            text = extract_scanned_pdf(path)

        return (text)

    # ---- Unsupported ----
    return "Unsupported file format"
