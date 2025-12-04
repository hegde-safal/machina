import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_document(text: str):
    prompt = f"""
    Summarize the following document in 5–7 crisp bullet points.
    Focus on key actionable points, deadlines, and important entities.

    Document:
    {text}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text
