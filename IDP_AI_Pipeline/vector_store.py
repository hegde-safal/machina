import numpy as np

class VectorStore:
    def __init__(self):
        self.embeddings = []
        self.documents = []

    def add(self, embedding, text):
        self.embeddings.append(embedding)
        self.documents.append(text)

    def search(self, query_embedding, top_k=3):
        """Returns the top_k most similar documents."""
        if not self.embeddings:
            return []

        # Convert to numpy vectors
        emb_matrix = np.array(self.embeddings)

        # Cosine similarity
        scores = np.dot(emb_matrix, query_embedding) / (
            np.linalg.norm(emb_matrix, axis=1) * np.linalg.norm(query_embedding)
        )

        top_indices = np.argsort(scores)[-top_k:][::-1]

        return [self.documents[i] for i in top_indices]
