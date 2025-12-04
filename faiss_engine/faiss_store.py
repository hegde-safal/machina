import faiss
import numpy as np

class FAISSStore:
    def __init__(self, dim=768):
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.vectors = []
        self.documents = []   # raw text or chunks
        self.metadata = []    # optional metadata objects
    
    def add(self, embedding, text, meta=None):
        vector = np.array([embedding], dtype='float32')
        self.index.add(vector)
        
        self.vectors.append(embedding)
        self.documents.append(text)
        self.metadata.append(meta or {})

    def search(self, query_embedding, top_k=5):
        query_vector = np.array([query_embedding], dtype='float32')
        distances, indices = self.index.search(query_vector, top_k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.documents):
                results.append({
                    "text": self.documents[idx],
                    "metadata": self.metadata[idx],
                    "distance": float(distances[0][0])
                })
        return results
