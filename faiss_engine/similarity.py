from IDP_AI_Pipeline.embedder import embed_text
import numpy as np

class DocumentSimilarityEngine:
    def __init__(self, faiss_store):
        self.store = faiss_store
    
    def embed_full_doc(self, text):
        # embed whole document as a single vector
        return embed_text(text)
    
    def find_similar_documents(self, text, top_k=5):
        query = self.embed_full_doc(text)
        results = self.store.search(query, top_k=top_k)
        
        # return unique doc_id matches
        seen = set()
        deduped = []
        
        for r in results:
            doc_id = r["metadata"].get("doc_id")
            if doc_id and doc_id not in seen:
                seen.add(doc_id)
                deduped.append(r)
        
        return deduped
