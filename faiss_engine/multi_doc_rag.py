from IDP_AI_Pipeline.embedder import embed_text
from IDP_AI_Pipeline.summarizer import call_gemini

class MultiDocRAG:
    def __init__(self, faiss_store):
        self.store = faiss_store

    def query(self, question, top_k=5):
        query_emb = embed_text(question)
        relevant_chunks = self.store.search(query_emb, top_k=top_k)

        context = "\n\n".join([
            chunk["text"] for chunk in relevant_chunks
        ])

        prompt = f"""
You are an IDP assistant. Use ONLY the following context to answer the question.
If answer is not found, say "Information not present."

Context:
{context}

Question: {question}
"""

        answer = call_gemini(prompt)
        return {
            "answer": answer,
            "used_chunks": relevant_chunks
        }
