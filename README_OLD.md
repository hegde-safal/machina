# Machina — Intelligent Document Processing Platform

A web-based Intelligent Document Processing (IDP) solution designed for infrastructure and enterprise operations.  
Built during the **8th Mile x Overnight Hackathon**.

---

## 🚨 Problem

Organizations handling engineering, HR, safety, procurement, and compliance documents struggle with:

- Unstructured formats (scanned PDFs, docs, images)
- No unified tracking or routing system
- Delayed decisions due to fragmented information
- Lost or duplicated documents
- Lack of traceability and institutional memory

---

## 🎯 Solution

Machina automates document intake, understanding, routing, and search using:

- OCR for text extraction  
- LLM-based summarization and classification  
- Automatic routing to relevant departments  
- Deadline & priority detection  
- Admin ↔ Employee document-specific chat  
- Semantic search using embeddings + FAISS  
:contentReference[oaicite:0]{index=0}

---

## 🧠 Core Features

| Feature | Status |
|--------|--------|
| Role-based login (Admin vs Department Users) | ✅ |
| Document upload (PDF / DOCX / Image) | ✅ |
| OCR + Text Extraction | ✅ |
| Auto summarization & routing | ✅ |
| Priority & Due-date inference | ⚙️ |
| Document status workflow | ✅ |
| Document-level chat | ✅ |
| Semantic search with vector embeddings | ✅ |
| Scalable architecture for enterprise use | 🚧 Future |

---

## 🏛️ System Architecture

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

🗂️ Database Schema

Machina uses PostgreSQL to store authentication data, processed document metadata, workflow status, and messaging history.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'employee')),
    department TEXT
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    category TEXT,
    department TEXT,
    priority TEXT,
    due_date TIMESTAMP,
    status TEXT DEFAULT 'Pending',
    summary TEXT,
    upload_time TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    doc_id INT REFERENCES documents(id) ON DELETE CASCADE,
    sender_role TEXT CHECK (sender_role IN ('admin', 'employee')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);


FAISS stores embeddings separately and links them using the document ID for retrieval.

🔍 Semantic Search Workflow
Document Upload
      ▼
OCR → Text Chunking → Embeddings → FAISS Index
      ▼
User Search Query
      ▼
Query Embedding → Similarity Search → Ranked Results


Role-based filtering ensures:

Admins can search all documents

Employees only see results assigned to their department

🧰 Tech Stack
Layer	Technology
Frontend	Next.js
Backend	FastAPI
AI Processing	OCR + LLM Summarization + Classification
Semantic Search	FAISS Vector Store
Database	PostgreSQL
Authentication	JWT
Storage	Local / Cloud Bucket Ready
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/<username>/machina.git
cd machina

2️⃣ Install Backend Dependencies
pip install -r requirements.txt

3️⃣ Install Frontend Dependencies
npm install

4️⃣ Start Backend Server
uvicorn main:app --reload

5️⃣ Start Frontend
npm run dev

🧪 How to Use

Login as Admin

Upload a document (PDF/DOCX/Image)

System processes file → extracts metadata → assigns routing

View auto-generated:

Summary

Category

Priority

Due Date

Assigned Department

Employee logs in → views assigned document

Chat inside the document →

Pending → In Review → Replied


Use natural language semantic search to retrieve related files.

🚀 Future Enhancements
Planned Feature	Status
Email ingestion & auto-processing	⏳
AI suggested responses for employees	⏳
Multi-language OCR support	⏳
Real-time analytics dashboard	⏳
Enterprise Integrations (SAP, SharePoint, Jira)	⏳


👥 Team Machina
Member	Role
Safal Hegde	Backend + Database
Ryan Dave Fernandes	Frontend
Rohith S Panchamukhi	Machine Learning + OCR Pipeline
Stavan Rahul Khobare	UI/UX & Workflow Logic
