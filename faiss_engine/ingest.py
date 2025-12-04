from IDP_AI_Pipeline.chunker import chunk_text
from IDP_AI_Pipeline.embedder import embed_text
from .faiss_store import FAISSStore

class DocumentIngestor:
    def __init__(self):
        self.store = FAISSStore(dim=768)

    def ingest_document(self, text, doc_id):
        chunks = chunk_text(text)
        for idx, chunk in enumerate(chunks):
            embedding = embed_text(chunk)
            metadata = {
                "doc_id": doc_id,
                "chunk_id": idx
            }
            self.store.add(embedding, chunk, meta=metadata)

    def get_store(self):
        return self.store
