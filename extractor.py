import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_key_information(text: str):
    """
    Extracts structured key information from the document text.
    Returns a JSON object with fields like Invoice Number, Date, Amount, etc.
    """
    prompt = f"""
    Extract key-value pairs from the following document.
    Return the result as a VALID JSON object (no markdown formatting, just raw JSON) with the following fields (if present):
    - DocumentType (e.g., Invoice, PO, Contract)
    - ReferenceNumber (Invoice #, PO #, etc.)
    - Date (Document Date)
    - TotalAmount (with currency)
    - BuyerName
    - SellerName
    - ContactPerson
    - Items (list of objects with Description, Quantity, UnitPrice, Total)

    If a field is not found, use null.

    Document:
    {text}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={
            'response_mime_type': 'application/json'
        }
    )

    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON response", "raw_text": response.text}
