import os
from dotenv import load_dotenv
from google import genai
from embedder import embed_text
from vector_store import VectorStore

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

store = VectorStore()

def build_index(chunks):
    for chunk in chunks:
        emb = embed_text(chunk)
        store.add(emb, chunk)

def rag_query(query):
    query_emb = embed_text(query)
    retrieved = store.search(query_emb, top_k=3)

    context = "\n\n".join(retrieved)

    prompt = f"""
    You are an expert assistant. Use ONLY the information in the context to answer.

    Context:
    {context}

    Query:
    {query}

    Answer:
    """

    res = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return res.text
