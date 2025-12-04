from IDP_AI_Pipeline.embedder import embed_text

class GlobalSearch:
    def __init__(self, faiss_store):
        self.store = faiss_store

    def search(self, query, top_k=10):
        query_emb = embed_text(query)
        results = self.store.search(query_emb, top_k=top_k)
        return results
