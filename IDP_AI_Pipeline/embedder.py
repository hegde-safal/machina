import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def embed_text(text: str):
    """Returns a 768-dim embedding vector."""
    res = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text
    )
    return res.embeddings[0].values
