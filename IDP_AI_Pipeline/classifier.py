from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

CATEGORIES = [
    "HR Document",
    "Invoice",
    "Purchase Order",
    "Engineering Document",
    "Safety Document",
    "Compliance Document",
    "General Operations Document"
]

def classify_document(text: str):
    prompt = f"""
    Classify the document into ONE category from this list:
    {", ".join(CATEGORIES)}

    Document:
    {text}

    Respond with only the category name.
    """

    result = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return result.text.strip()
