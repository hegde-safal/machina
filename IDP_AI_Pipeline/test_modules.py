import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add the parent directory to sys.path to import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chunker import chunk_text
from router import route_document
from vector_store import VectorStore

# We need to mock genai before importing modules that use it at top level if we want to avoid init issues,
# but the current modules instantiate client at top level. 
# So we might need to patch 'google.genai.Client' before importing if we were strict,
# but for simplicity we will patch the client instance in the modules or mock the methods.

class TestIDPModules(unittest.TestCase):

    def test_chunker(self):
        text = "a" * 1000
        chunks = chunk_text(text, chunk_size=100, overlap=10)
        self.assertTrue(len(chunks) > 1)
        self.assertTrue(len(chunks[0]) == 100)

    def test_router(self):
        self.assertEqual(route_document("Invoice"), "Finance Team")
        self.assertEqual(route_document("Unknown"), "General Review Team")

    def test_vector_store(self):
        store = VectorStore()
        store.add([0.1, 0.2], "doc1")
        store.add([0.9, 0.8], "doc2")
        
        # Search for something close to doc2
        results = store.search([0.9, 0.9], top_k=1)
        self.assertEqual(results[0], "doc2")

    @patch('classifier.client')
    def test_classifier(self, mock_client):
        from classifier import classify_document
        
        # Mock response
        mock_response = MagicMock()
        mock_response.text = "Invoice"
        mock_client.models.generate_content.return_value = mock_response
        
        category = classify_document("bill for services")
        self.assertEqual(category, "Invoice")

    @patch('summarizer.client')
    def test_summarizer(self, mock_client):
        from summarizer import summarize_document
        
        mock_response = MagicMock()
        mock_response.text = "- Point 1\n- Point 2"
        mock_client.models.generate_content.return_value = mock_response
        
        summary = summarize_document("long text")
        self.assertIn("Point 1", summary)

    @patch('embedder.client')
    def test_embedder(self, mock_client):
        from embedder import embed_text
        
        mock_response = MagicMock()
        mock_response.embeddings = [MagicMock(values=[0.1, 0.2, 0.3])]
        mock_client.models.embed_content.return_value = mock_response
        
        emb = embed_text("text")
        self.assertEqual(emb, [0.1, 0.2, 0.3])

    @patch('extractor.client')
    def test_extractor(self, mock_client):
        from extractor import extract_key_information
        
        mock_response = MagicMock()
        mock_response.text = '{"DocumentType": "Invoice", "TotalAmount": 100}'
        mock_client.models.generate_content.return_value = mock_response
        
        data = extract_key_information("invoice text")
        self.assertEqual(data['DocumentType'], "Invoice")
        self.assertEqual(data['TotalAmount'], 100)

if __name__ == '__main__':
    unittest.main()
