"""
Demo script to test the full IDP pipeline with real API calls.
"""
from pipeline import run_full_pipeline
import json

# Sample document text
sample_document = """
Purchase Order #PO-2024-445
Date: December 4, 2024

Client: Metro Engineering Ltd
Address: 123 Industrial Park, Mumbai, Maharashtra

Items Ordered:
- 20 Industrial Centrifugal Pumps (Model: CP-500)
- Unit Price: ₹45,000
- Total: ₹9,00,000

Delivery Requirements:
- Delivery Date: 10 January 2025
- Priority: High
- Installation Required: Yes

Payment Terms: Net 30 days
Authorized by: Rahul Sharma (Procurement Manager)

Special Instructions:
All pumps must be tested and certified before delivery.
ISO compliance certificates required.
"""

print("=" * 60)
print("IDP AI PIPELINE DEMO")
print("=" * 60)
print("\n📄 Processing Document...\n")

# Run the full pipeline
query_text = "What is the total amount enlisted in this order?"
result = run_full_pipeline(sample_document, rag_query_text=query_text)

# Display results
print("✅ PIPELINE COMPLETED!\n")
print("=" * 60)
print("📊 RESULTS:")
print("=" * 60)

print("\n📝 SUMMARY:")
print(result['summary'])

print("\n🏷️  CATEGORY:")
print(f"   {result['category']}")

print("\n📮 ROUTING DESTINATION:")
print(f"   → {result['destination']}")

print("\n🔑 EXTRACTED INFORMATION:")
print(json.dumps(result['extracted_data'], indent=3))

print("\n🔍 RAG SAMPLE QUERY:")
print(f"   Q:{query_text}")
print(f"   A: {result['rag_sample_answer']}")

print("\n" + "=" * 60)
print("✨ Demo Complete!")
print("=" * 60)

# Optional: Save results to JSON
with open('pipeline_results.json', 'w') as f:
    json.dump(result, f, indent=2)
print("\n💾 Results saved to: pipeline_results.json")
