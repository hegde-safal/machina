import unittest
from unittest.mock import MagicMock, patch
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pipeline import run_full_pipeline

class TestIntegration(unittest.TestCase):

    @patch('summarizer.client')
    @patch('classifier.client')
    @patch('embedder.client')
    @patch('rag_engine.client')
    @patch('extractor.client')
    def test_full_pipeline(self, mock_ext_client, mock_rag_client, mock_emb_client, mock_cls_client, mock_sum_client):
        # Setup Mocks
        
        # Summarizer mock
        mock_sum_response = MagicMock()
        mock_sum_response.text = "Summary"
        mock_sum_client.models.generate_content.return_value = mock_sum_response
        
        # Classifier mock
        mock_cls_response = MagicMock()
        mock_cls_response.text = "Invoice"
        mock_cls_client.models.generate_content.return_value = mock_cls_response
        
        # Extractor mock
        mock_ext_response = MagicMock()
        mock_ext_response.text = '{"DocumentType": "Invoice", "TotalAmount": 500}'
        mock_ext_client.models.generate_content.return_value = mock_ext_response

        # Embedder mock (used by build_index and rag_query)
        mock_emb_response = MagicMock()
        # Return a valid 768-dim vector (or whatever size, just needs to be list of floats)
        # The vector store expects a list, and embed_text returns res.embeddings[0]
        mock_emb_response.embeddings = [MagicMock(values=[0.1] * 768)]
        mock_emb_client.models.embed_content.return_value = mock_emb_response
        
        # RAG GenAI mock
        mock_rag_response = MagicMock()
        mock_rag_response.text = "RAG Answer"
        mock_rag_client.models.generate_content.return_value = mock_rag_response

        # Run Pipeline
        input_text = "This is a sample invoice document for testing."
        result = run_full_pipeline(input_text)
        
        # Assertions
        self.assertEqual(result['summary'], "Summary")
        self.assertEqual(result['category'], "Invoice")
        self.assertEqual(result['destination'], "Finance Team") # Mapped from Invoice
        self.assertEqual(result['extracted_data']['TotalAmount'], 500)
        self.assertEqual(result['rag_sample_answer'], "RAG Answer")
        
        print("\nPipeline Result:")
        print(result)

if __name__ == '__main__':
    unittest.main()
