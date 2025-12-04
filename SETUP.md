# IDP AI Pipeline Setup Guide

This guide will help you set up and run the IDP AI Pipeline, which consists of two layers:
1. **Layer 1:** Single-document intelligence (Summary, Classification, Extraction, RAG)
2. **Layer 2:** Cross-document intelligence (FAISS Vector Store, Global Search, Multi-doc RAG)

## Prerequisites
- Python 3.10+
- A Google Gemini API Key

## 1. Clone the Repository
```bash
git clone https://github.com/hegde-safal/machina.git
cd machina
```

## 2. Set Up Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```

## 3. Install Dependencies
```bash
pip install -r IDP_AI_Pipeline/requirements.txt
```

## 4. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
# .env
GEMINI_API_KEY=your_actual_api_key_here
```

## 5. Verify Installation
Run the full integration test to verify both layers are working:
```bash
python test_full_integration.py
```

## 6. Running the Pipeline

### Layer 1 Demo (Single Document)
```bash
python IDP_AI_Pipeline/demo.py
```

### Layer 2 Demo (Cross-Document)
```bash
python faiss_engine/test_layer2.py
```

## Troubleshooting
- **ModuleNotFoundError:** Ensure you are running python from the root directory.
- **API Key Error:** Double check your `.env` file and ensure `python-dotenv` is installed.
