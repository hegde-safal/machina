# Machina — Intelligent Document Processing Platform

A web-based Intelligent Document Processing (IDP) solution designed for infrastructure and enterprise operations.  
Built during the **8th Mile x Overnight Hackathon**.

## 🚨 Problem

Organizations handling engineering, HR, safety, procurement, and compliance documents struggle with:

- Unstructured formats (scanned PDFs, docs, images)
- No unified tracking or routing system
- Delayed decisions due to fragmented information
- Lost or duplicated documents
- Lack of traceability and institutional memory

## 🎯 Solution

Machina automates document intake, understanding, routing, and search using:

- **OCR for text extraction** (pytesseract + tesseract-ocr)
- **Automated document processing** (Python backend)
- **Automatic storage & retrieval** (Supabase cloud database)
- **LLM-based summarization and classification** (coming soon)
- **Semantic search using embeddings** (coming soon)

---

## 📊 Architecture (Current Phase)

**Backend-Only Processing:**

```
┌─────────────────────────────────────┐
│   Your Backend (Deployed)           │
│                                     │
│  1. Query Supabase Database         │
│  2. Download from Storage Bucket    │
│  3. Run master_extractor.py         │
│  4. Save extracted text to DB       │
│  5. Update status                   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Supabase (Cloud)                │
│                                     │
│  ├─ documents table (metadata)      │
│  ├─ Storage bucket (PDF files)      │
│  └─ Extracted text (stored in DB)   │
└─────────────────────────────────────┘
```

**Future Full Architecture:**

```
┌─────────────────────┐
│     Frontend        │  Next.js  
│  Login, Dashboards  │
│   Document Viewer   │
└───────────┬─────────┘
            │
            ▼
┌─────────────────────┐
│      Backend        │  FastAPI  
│ Upload, Process, DB │
│  NLP + Routing API  │
└───────────┬─────────┘
            │
            ▼
┌────────────────────────────────────┐
│        Intelligence Layer          │
│ OCR → Summarization → Classification│
│ Embeddings → FAISS Semantic Search │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│    Storage & Persistence Layer     │
│ PostgreSQL (metadata + messages)   │
│ FAISS (vector search index)        │
└────────────────────────────────────┘
```

## 🧠 Core Features

| Feature | Status |
|--------|--------|
| Role-based login (Admin vs Department Users) | ⏳ Future |
| Document upload (PDF / DOCX / Image) | ✅ |
| OCR + Text Extraction | ✅ |
| Auto summarization & routing | ⏳ Future |
| Priority & Due-date inference | ⏳ Future |
| Document status workflow | ✅ |
| Document-level chat | ⏳ Future |
| Semantic search with vector embeddings | ⏳ Future |
| Scalable architecture for enterprise use | ✅ |

## 📁 Project Structure

```
machina/
├── extraction/                    # Text extraction modules
│   ├── __init__.py
│   ├── master_extractor.py       # Main router for extraction
│   ├── pdf.py                    # PDF text extraction
│   ├── ocr.py                    # OCR for images & scanned PDFs
│   └── docx.py                   # DOCX extraction
├── cleaning/
│   └── text_cleaner.py           # Text post-processing (placeholder)
├── extracted_text/               # Output directory
│   ├── IDP_Hackathon_Roadmap.txt
│   ├── Intelligent_Document_Processing_Detailed_Roadmap.txt
│   └── PROBLEM_STATEMENTS.txt
├── document_processor.py         # Main processing logic
├── supabase_integration.py       # Supabase client wrapper
├── requirements.txt              # Python dependencies
├── test_master_extractor.py      # Test extraction pipeline
├── test_document_processor.py    # Test full workflow
├── test_supabase_extraction.py   # Test Supabase integration
└── README.md                     # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. System Dependencies (for OCR)
```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr tesseract-ocr-eng

# macOS
brew install tesseract
```

### 3. Configure Supabase
Update `supabase_integration.py` or set environment variables:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Run Document Processing
```bash
python document_processor.py
```

## 📋 Processing Pipeline

1. **Query Database** - Fetches documents with `status = 'Pending'` from Supabase
2. **Download Files** - Retrieves from Supabase Storage bucket to `/tmp`
3. **Extract Text** - Uses master_extractor with intelligent routing:
   - PDFs with text → `pdfplumber` (fast digital extraction)
   - Scanned PDFs/Images → `pytesseract` OCR (accurate for scanned docs)
   - DOCX files → `docx2txt` extraction
4. **Save Results** - Stores extracted text in database
5. **Update Status** - Changes status to `'Text Extracted'`, sets `processed=True`, records timestamp

## 📊 Supported File Types

✅ **PDF (digital text)** - Uses pdfplumber for fast extraction
✅ **PDF (scanned)** - Uses pytesseract for OCR extraction
✅ **DOCX** - Uses docx2txt for extraction
✅ **Images (JPG, PNG)** - Uses pytesseract for OCR

## �� Testing

```bash
# Test master extractor on sample PDF
python test_master_extractor.py

# Test full document processor
python test_document_processor.py

# Test Supabase integration
python test_supabase_extraction.py
```

## 📈 Performance Benchmarks

- Small PDF (< 5 pages): ~1-2 seconds
- Medium PDF (5-50 pages): ~5-10 seconds
- Large PDF (50+ pages): ~10-30 seconds
- Scanned PDF (OCR): ~10-60 seconds depending on size
- Batch (10 docs): ~30-120 seconds total

## 🌐 Deployment

### Railway
```bash
# Create Procfile
echo "worker: python document_processor.py" > Procfile

# Push to GitHub - Railway auto-deploys
git push origin main
```

### Your Backend / VPS
```bash
# Option 1: Run as cron job (every hour)
0 * * * * /usr/bin/python3 /path/to/document_processor.py

# Option 2: Run continuously
nohup python document_processor.py > processing.log 2>&1 &
```

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Processing | Python 3.12 |
| PDF Extraction | pdfplumber |
| OCR | pytesseract + tesseract-ocr 5.3.4 |
| Document Formats | DOCX (docx2txt), Images (PIL/Pillow) |
| Cloud Database | Supabase (PostgreSQL) |
| Cloud Storage | Supabase Storage |
| Authentication | Supabase Auth + Service Role Key |

## 🛠️ Core Modules

| File | Purpose |
|------|---------|
| `document_processor.py` | Main orchestrator (queries DB, downloads files, updates status) |
| `extraction/master_extractor.py` | File type router with intelligent fallback logic |
| `extraction/pdf.py` | Digital PDF text extraction using pdfplumber |
| `extraction/ocr.py` | OCR extraction for images & scanned PDFs |
| `extraction/docx.py` | DOCX extraction using docx2txt |
| `extraction/__init__.py` | Module exports and public API |
| `supabase_integration.py` | Supabase client wrapper (queries DB, downloads from storage) |
| `cleaning/text_cleaner.py` | Text post-processing (placeholder for future) |

## ✅ Current Status

**Fully Implemented:**
- ✅ PDF extraction (digital & scanned)
- ✅ OCR support for images and scanned PDFs
- ✅ DOCX support
- ✅ Supabase integration with Service Role Key
- ✅ Database queries and updates with timestamps
- ✅ Document status workflow
- ✅ File download & processing pipeline
- ✅ Batch document processing
- ✅ Error handling and logging

**In Development:**
- 🚧 Text cleaning pipeline
- 🚧 LLM summarization
- 🚧 Auto-categorization & routing
- 🚧 Priority & deadline detection
- 🚧 Frontend dashboard (Next.js)
- 🚧 Semantic search with embeddings
- 🚧 Document-level chat interface

## 📊 Database Schema

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',  -- 'Pending' or 'Text Extracted'
    extracted_text TEXT,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 👥 Team Machina

| Member | Role |
|--------|------|
| Safal Hegde | Backend + Database |
| Ryan Dave Fernandes | Frontend |
| Rohith S Panchamukhi | Machine Learning + OCR Pipeline |
| Stavan Rahul Khobare | UI/UX & Workflow Logic |

---

**Ready to process?** Run `python document_processor.py` 🚀
