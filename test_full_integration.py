"""
Integration Test: Layer 1 + Layer 2 Compatibility Check
Tests both single-document and cross-document intelligence working together.
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("=" * 60)
print("FULL INTEGRATION TEST: LAYER 1 + LAYER 2")
print("=" * 60)

# ============================================================
# TEST IMPORTS
# ============================================================
print("\n📦 Testing Imports...")

# Layer 1 imports
try:
    from IDP_AI_Pipeline.summarizer import summarize_document, call_gemini
    print("   ✓ summarizer (summarize_document, call_gemini)")
except ImportError as e:
    print(f"   ✗ summarizer: {e}")

try:
    from IDP_AI_Pipeline.classifier import classify_document
    print("   ✓ classifier (classify_document)")
except ImportError as e:
    print(f"   ✗ classifier: {e}")

try:
    from IDP_AI_Pipeline.router import route_document
    print("   ✓ router (route_document)")
except ImportError as e:
    print(f"   ✗ router: {e}")

try:
    from IDP_AI_Pipeline.chunker import chunk_text
    print("   ✓ chunker (chunk_text)")
except ImportError as e:
    print(f"   ✗ chunker: {e}")

try:
    from IDP_AI_Pipeline.embedder import embed_text
    print("   ✓ embedder (embed_text)")
except ImportError as e:
    print(f"   ✗ embedder: {e}")

try:
    from IDP_AI_Pipeline.extractor import extract_key_information
    print("   ✓ extractor (extract_key_information)")
except ImportError as e:
    print(f"   ✗ extractor: {e}")

try:
    from IDP_AI_Pipeline.pipeline import run_full_pipeline
    print("   ✓ pipeline (run_full_pipeline)")
except ImportError as e:
    print(f"   ✗ pipeline: {e}")

# Layer 2 imports
try:
    from faiss_engine import FAISSStore
    print("   ✓ faiss_engine.FAISSStore")
except ImportError as e:
    print(f"   ✗ FAISSStore: {e}")

try:
    from faiss_engine import DocumentIngestor
    print("   ✓ faiss_engine.DocumentIngestor")
except ImportError as e:
    print(f"   ✗ DocumentIngestor: {e}")

try:
    from faiss_engine import MultiDocRAG
    print("   ✓ faiss_engine.MultiDocRAG")
except ImportError as e:
    print(f"   ✗ MultiDocRAG: {e}")

try:
    from faiss_engine import DocumentSimilarityEngine
    print("   ✓ faiss_engine.DocumentSimilarityEngine")
except ImportError as e:
    print(f"   ✗ DocumentSimilarityEngine: {e}")

try:
    from faiss_engine import GlobalSearch
    print("   ✓ faiss_engine.GlobalSearch")
except ImportError as e:
    print(f"   ✗ GlobalSearch: {e}")

try:
    from faiss_engine import MetadataStore
    print("   ✓ faiss_engine.MetadataStore")
except ImportError as e:
    print(f"   ✗ MetadataStore: {e}")

# ============================================================
# TEST DOCUMENTS
# ============================================================
doc1 = """
Invoice #INV-2024-001
Date: December 5, 2024
Client: Acme Corporation
Total Amount: $5,000
Items: Software License (1 year)
Payment Due: January 5, 2025
Contact: Jane Doe (Accounts Manager)
"""

doc2 = """
Purchase Order #PO-2024-445
Client: Metro Engineering Ltd
Items: 20 industrial pumps at ₹45,000 each
Total: ₹9,00,000
Delivery: January 10, 2025
Priority: High
Authorized by: Rahul Sharma (Procurement Manager)
"""

doc3 = """
Safety Compliance Report #SCR-2024-050
Facility: Metro Engineering Plant A
Inspection Date: December 1, 2024
Status: All safety protocols met
Next Inspection: June 1, 2025
Inspector: Amit Patel (Safety Officer)
"""

# ============================================================
# LAYER 1: SINGLE DOCUMENT INTELLIGENCE
# ============================================================
print("\n" + "=" * 60)
print("LAYER 1: Single Document Intelligence")
print("=" * 60)

print("\n📄 Processing Document 1 (Invoice)...")

# 1. Summarize
print("\n1️⃣ Summarization...")
summary = summarize_document(doc1)
print(f"   Summary: {summary[:150]}...")

# 2. Classify
print("\n2️⃣ Classification...")
category = classify_document(doc1)
print(f"   Category: {category}")

# 3. Route
print("\n3️⃣ Routing...")
destination = route_document(category)
print(f"   Destination: {destination}")

# 4. Extract
print("\n4️⃣ Key Extraction...")
extracted = extract_key_information(doc1)
print(f"   Extracted: {extracted}")

# 5. Full Pipeline
print("\n5️⃣ Full Pipeline on Document 2 (PO)...")
result = run_full_pipeline(doc2, rag_query_text="Who authorized this order?")
print(f"   Category: {result['category']}")
print(f"   Destination: {result['destination']}")
print(f"   RAG Answer: {result['rag_sample_answer'][:100]}...")

# ============================================================
# LAYER 2: CROSS-DOCUMENT INTELLIGENCE
# ============================================================
print("\n" + "=" * 60)
print("LAYER 2: Cross-Document Intelligence")
print("=" * 60)

# 1. Ingest all documents
print("\n1️⃣ Ingesting documents into FAISS...")
ingestor = DocumentIngestor()
ingestor.ingest_document(doc1, "doc_invoice_001")
ingestor.ingest_document(doc2, "doc_po_445")
ingestor.ingest_document(doc3, "doc_safety_050")
print("   ✓ Ingested 3 documents")

faiss_store = ingestor.get_store()

# 2. Global Search
print("\n2️⃣ Global Search: 'safety inspection'...")
global_search = GlobalSearch(faiss_store)
results = global_search.search("safety inspection", top_k=3)
print(f"   Found {len(results)} relevant chunks")

# 3. Document Similarity
print("\n3️⃣ Finding similar documents to Invoice...")
similarity = DocumentSimilarityEngine(faiss_store)
similar = similarity.find_similar_documents("Invoice for software payment", top_k=3)
print(f"   Found {len(similar)} similar documents")

# 4. Multi-Doc RAG
print("\n4️⃣ Multi-Doc RAG Query...")
multi_rag = MultiDocRAG(faiss_store)
answer = multi_rag.query("When is the next safety inspection scheduled?")
print(f"   Q: When is the next safety inspection scheduled?")
print(f"   A: {answer['answer'][:150]}...")

# 5. Metadata Store
print("\n5️⃣ Metadata Store...")
meta_store = MetadataStore()
meta_store.add_doc("doc_invoice_001", {"type": "Invoice", "amount": "$5,000"})
meta_store.add_doc("doc_po_445", {"type": "PO", "amount": "₹9,00,000"})
meta_store.add_doc("doc_safety_050", {"type": "Safety Report"})
print(f"   Stored metadata for {len(meta_store.list_docs())} documents")

# ============================================================
# COMBINED WORKFLOW
# ============================================================
print("\n" + "=" * 60)
print("COMBINED WORKFLOW: Layer 1 → Layer 2")
print("=" * 60)

print("\n🔄 Processing new document through both layers...")
new_doc = """
HR Policy Update #HR-2024-012
Effective Date: January 1, 2025
Subject: Remote Work Guidelines
- Employees may work remotely up to 3 days per week
- Core hours: 10 AM - 4 PM
- Monthly office attendance required
Approved by: Sarah Johnson (HR Director)
"""

# Layer 1: Process single document
print("\n   Layer 1: Single-doc processing...")
l1_result = run_full_pipeline(new_doc, rag_query_text="What are the remote work guidelines?")
print(f"   → Category: {l1_result['category']}")
print(f"   → Destination: {l1_result['destination']}")

# Layer 2: Add to cross-document store
print("\n   Layer 2: Adding to cross-document store...")
ingestor.ingest_document(new_doc, "doc_hr_012")
meta_store.add_doc("doc_hr_012", {
    "type": l1_result['category'],
    "extracted": l1_result['extracted_data']
})
print(f"   → Now tracking {len(meta_store.list_docs())} documents")

# Query across all documents
print("\n   Layer 2: Cross-document query...")
answer = multi_rag.query("What are the important dates mentioned across all documents?")
print(f"   → Answer: {answer['answer'][:200]}...")

print("\n" + "=" * 60)
print("✨ FULL INTEGRATION TEST PASSED!")
print("=" * 60)
print("\nBoth layers are compatible and working together! 🎉")
