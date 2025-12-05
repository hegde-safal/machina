from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import shutil
import os

from .service import service

app = FastAPI(title="Machina Backend")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class QueryRequest(BaseModel):
    query: str

class DocumentResponse(BaseModel):
    filename: str
    summary: Optional[str] = None
    category: Optional[str] = None
    destination: Optional[str] = None

# Routes

@app.get("/")
def read_root():
    return {"message": "Machina Backend is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        # Decode bytes to string assuming utf-8 for text files
        # For PDFs, we might need more complex handling, but let's assume text/md for now 
        # or try to extract text if it's a PDF.
        # Given the "test_pdf_integration.py" failure earlier, let's stick to text/simple handling first
        # or use a library if we want to be robust.
        # The user mentioned "test_pdf_integration.py" failed, so maybe PDF support is shaky.
        # But the prompt says "IDP_AI_Pipeline" is for document processing.
        # Let's try to decode as utf-8, if fails, maybe it's binary (PDF).
        
        text_content = ""
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            # If it's a PDF, we might need to save it and use a PDF extractor.
            # For this simple integration, let's just say we support text-based files 
            # OR we can try to use the `document_processor` if it exists in the root.
            # I saw `document_processor.py` in the root.
            text_content = f"Binary content from {file.filename} (PDF extraction not fully wired in this simple endpoint yet)"
        
        result = service.process_document(file.filename, text_content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
def query_documents(request: QueryRequest):
    results = service.query(request.query)
    return {"results": results}

@app.get("/documents", response_model=List[DocumentResponse])
def get_documents():
    docs = service.get_documents()
    # Transform to match response model
    return [
        DocumentResponse(
            filename=d["filename"],
            summary=d["pipeline_result"].get("summary"),
            category=d["pipeline_result"].get("category"),
            destination=d["pipeline_result"].get("destination")
        ) for d in docs
    ]

# Admin / Department Routes (Mocked for now)
@app.get("/admin/stats")
def get_admin_stats():
    return {
        "total_documents": len(service.get_documents()),
        "system_status": "Healthy"
    }

@app.get("/departments/{dept_name}")
def get_department_docs(dept_name: str):
    # Filter documents by destination/category if it matches department
    all_docs = service.get_documents()
    filtered = [
        d for d in all_docs 
        if d["pipeline_result"].get("destination", "").lower() == dept_name.lower()
    ]
    return filtered

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
