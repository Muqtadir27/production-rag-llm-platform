"""
Minimal RAG Backend - Simplest possible implementation
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("\n" + "="*60)
print("Loading RAG Pipeline...")
print("="*60)

try:
    from backend.app.services.rag_pipeline import RAGPipeline
    rag = RAGPipeline(
        documents_dir="data/documents",
        index_path="data/vector_index"
    )
    print("✓ RAG loaded. Starting server...\n")
except Exception as e:
    print(f"✗ Error: {e}")
    import sys, traceback
    traceback.print_exc()
    sys.exit(1)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    question: str
    answer: str
    status: str
    retrieved_documents: List[Dict[str, Any]]

@app.get("/")
def root():
    return {"status": "ready", "message": "RAG API running"}

@app.post("/api/query", response_model=QueryResponse)
def query(request: QueryRequest):
    try:
        result = rag.query(request.question, top_k=request.top_k)
        return QueryResponse(
            question=result['question'],
            answer=result['answer'],
            status=result['status'],
            retrieved_documents=result['retrieved_documents']
        )
    except Exception as e:
        logger.error(f"Query error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
def status():
    try:
        stats = rag.get_statistics()
        return {
            "status": "ready",
            "documents": stats['vector_store']['total_documents']
        }
    except Exception as e:
        logger.error(f"Status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Server starting on http://0.0.0.0:8000")
    print("="*60 + "\n")
    
    # Don't use log_level parameter to keep it simple
    uvicorn.run(
        "backend.app.main_minimal:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
