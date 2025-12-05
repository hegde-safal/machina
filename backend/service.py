import sys
import os
from typing import List, Dict, Any

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from IDP_AI_Pipeline.pipeline import run_full_pipeline
from IDP_AI_Pipeline.embedder import embed_text
from faiss_engine.faiss_store import FAISSStore
from faiss_engine.global_search import GlobalSearch


class MachinaService:
    def __init__(self):
        self.faiss_store = FAISSStore()
        self.global_search = GlobalSearch(self.faiss_store)
        self.processed_documents = []

    def process_document(self, filename: str, content: str) -> Dict[str, Any]:
        """
        Runs the IDP pipeline on a document and ingests it into the FAISS store.
        """
        # Run IDP Pipeline
        pipeline_result = run_full_pipeline(content)
        
        # Ingest into FAISS (using the ingest helper or manually)
        # The ingest_document function in faiss_engine/ingest.py seems to take a file path, 
        # but we have content in memory. Let's look at how to adapt or just use the store directly.
        # Looking at faiss_engine/ingest.py might be useful, but for now I'll just use the store directly
        # based on what I saw in faiss_store.py
        
        # We want to store chunks or the whole text? 
        # run_full_pipeline chunks the text. Let's see if we can get those chunks.
        # pipeline_result doesn't seem to return chunks explicitly in the dict, 
        # but it calls build_index(chunks). 
        # However, that build_index is likely local to the pipeline run (in-memory list in rag_engine?).
        
        # For our global FAISS store, we should probably add the document summary or chunks.
        # Let's add the full text and summary for now.
        
        # Embed and add to FAISS
        # We can use the summary for better retrieval or the whole text.
        # Let's chunk it ourselves or use the summary.
        
        # For simplicity in this "simple website", let's index the summary and the full text as separate entries
        # or just the full text.
        
        # Let's use the summary for the vector store to keep it clean, 
        # or better, let's use the chunks if we can access them. 
        # Since run_full_pipeline doesn't return chunks, let's re-chunk or just store the text.
        
        embedding = embed_text(content)
        self.faiss_store.add(embedding, content, meta={"filename": filename, "type": "full_text"})
        
        if pipeline_result.get("summary"):
            summary_embedding = embed_text(pipeline_result["summary"])
            self.faiss_store.add(summary_embedding, pipeline_result["summary"], meta={"filename": filename, "type": "summary"})

        doc_record = {
            "filename": filename,
            "pipeline_result": pipeline_result
        }
        self.processed_documents.append(doc_record)
        
        return pipeline_result

    def query(self, query_text: str) -> List[Dict[str, Any]]:
        return self.global_search.search(query_text)

    def get_documents(self) -> List[Dict[str, Any]]:
        return self.processed_documents

# Singleton instance
service = MachinaService()
