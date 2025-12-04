"""
Test script for Layer 2: Cross-document Intelligence (FAISS Engine)
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from faiss_engine import FAISSStore, DocumentIngestor, MultiDocRAG, DocumentSimilarityEngine, GlobalSearch, MetadataStore

# Sample documents for testing
doc1 = """
Invoice #INV-2024-001
Date: December 5, 2024
Client: Acme Corporation
Total Amount: $5,000
Items: Software License (1 year)
Payment Due: January 5, 2025
"""

doc2 = """
Purchase Order #PO-2024-445
Client: Metro Engineering Ltd
Items: 20 industrial pumps
Total: ₹9,00,000
Delivery: January 10, 2025
Authorized by: Rahul Sharma
"""

doc3 = """
Contract Agreement #CON-2024-100
Between: TechCorp Inc and DigitalSoft LLC
Effective Date: January 1, 2025
Duration: 2 years
Value: $150,000
Contact: John Smith (Project Manager)
"""

print("=" * 60)
print("LAYER 2: FAISS ENGINE TEST")
print("=" * 60)

# 1. Test FAISSStore
print("\n✅ Testing FAISSStore...")
store = FAISSStore(dim=768)
print(f"   Created FAISS store with dimension: {store.dim}")

# 2. Test DocumentIngestor
print("\n✅ Testing DocumentIngestor...")
ingestor = DocumentIngestor()
print("   Ingesting 3 documents...")

ingestor.ingest_document(doc1, "doc_invoice_001")
print("   ✓ Ingested: Invoice")

ingestor.ingest_document(doc2, "doc_po_445")
print("   ✓ Ingested: Purchase Order")

ingestor.ingest_document(doc3, "doc_contract_100")
print("   ✓ Ingested: Contract")

# 3. Test GlobalSearch
print("\n✅ Testing GlobalSearch...")
faiss_store = ingestor.get_store()
global_search = GlobalSearch(faiss_store)

search_results = global_search.search("payment invoice amount", top_k=3)
print(f"   Found {len(search_results)} relevant chunks for 'payment invoice amount'")
if search_results:
    print(f"   Top result: {search_results[0]['text'][:100]}...")

# 4. Test DocumentSimilarityEngine
print("\n✅ Testing DocumentSimilarityEngine...")
similarity_engine = DocumentSimilarityEngine(faiss_store)

similar_docs = similarity_engine.find_similar_documents("Invoice for software services", top_k=3)
print(f"   Found {len(similar_docs)} similar documents")

# 5. Test MultiDocRAG
print("\n✅ Testing MultiDocRAG...")
multi_rag = MultiDocRAG(faiss_store)

question = "What is the total amount of the purchase order?"
print(f"   Q: {question}")
result = multi_rag.query(question)
print(f"   A: {result['answer'][:200]}...")
print(f"   Used {len(result['used_chunks'])} chunks")

# 6. Test MetadataStore
print("\n✅ Testing MetadataStore...")
meta_store = MetadataStore()
meta_store.add_doc("doc_invoice_001", {"type": "Invoice", "client": "Acme Corporation"})
meta_store.add_doc("doc_po_445", {"type": "Purchase Order", "client": "Metro Engineering"})
meta_store.add_doc("doc_contract_100", {"type": "Contract", "parties": ["TechCorp", "DigitalSoft"]})

print(f"   Stored metadata for {len(meta_store.list_docs())} documents")
print(f"   Invoice metadata: {meta_store.get_doc('doc_invoice_001')}")

print("\n" + "=" * 60)
print("✨ ALL LAYER 2 TESTS PASSED!")
print("=" * 60)
