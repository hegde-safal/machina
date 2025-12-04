from summarizer import summarize_document
from classifier import classify_document
from router import route_document
from chunker import chunk_text
from rag_engine import build_index, rag_query
from extractor import extract_key_information

def run_full_pipeline(text: str, rag_query_text: str = "What is the main topic of this document?"):
    """
    Runs the full IDP pipeline:
    1. Summarizes the document.
    2. Classifies the document.
    3. Routes the document based on classification.
    4. Extracts key information (Auto-Field Extraction).
    5. Chunks the text.
    6. Builds a vector index (RAG).
    7. Performs a sample RAG query.
    """
    
    # 1. Summarize
    summary = summarize_document(text)
    
    # 2. Classify
    category = classify_document(text)
    
    # 3. Route
    destination = route_document(category)

    # 4. Auto-Field Extraction
    extracted_data = extract_key_information(text)
    
    # 5. Chunk
    chunks = chunk_text(text)
    
    # 6. Build Index (RAG)
    build_index(chunks)
    
    # 7. Sample RAG Query (Demonstration)
    # We'll ask a generic question to prove retrieval works.
    # In a real app, this would come from a user.
    rag_result = rag_query(rag_query_text)
    
    return {
        "summary": summary,
        "category": category,
        "destination": destination,
        "extracted_data": extracted_data,
        "rag_sample_answer": rag_result
    }
