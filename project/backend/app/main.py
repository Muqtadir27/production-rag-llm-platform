"""
Simplified Backend - Load RAG once, serve queries
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TF logs

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

print("\n" + "="*60)
print("SIMPLE RAG BACKEND")
print("="*60)

# Step 1: Load RAG pipeline ONCE at startup
print("\nLoading RAG Pipeline...")
try:
    import sys
    sys.path.insert(0, '../..')  # Add project root to path
    from backend.app.services.rag_pipeline import RAGPipeline
    
    rag = RAGPipeline(
        documents_dir="data/documents",
        index_path="data/vector_index"
    )
    print("✓ RAG Pipeline loaded successfully\n")
except Exception as e:
    print(f"✗ Failed to load RAG Pipeline: {e}")
    import sys
    sys.exit(1)

# Step 2: Start FastAPI with the loaded pipeline
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI(title="NeuroCore RAG API", version="1.0.0")

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
async def root():
    return {
        "name": "NeuroCore RAG API",
        "status": "ready",
        "endpoints": {
            "query": "POST /api/query - Ask a question",
            "status": "GET /api/status - Get system status"
        }
    }

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Query the RAG system"""
    try:
        result = rag.query(request.question, top_k=request.top_k)
        return QueryResponse(
            question=result['question'],
            answer=result['answer'],
            status=result['status'],
            retrieved_documents=result['retrieved_documents']
        )
    except Exception as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def status():
    """Get system status"""
    try:
        stats = rag.get_statistics()
        return {
            "status": "ready",
            "documents": stats['vector_store']['total_documents'],
            "embedding_model": stats['embedding_model'],
            "llm_model": stats['llm_model']
        }
    except Exception as e:
        logger.error(f"Status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://0.0.0.0:8000")
    print("=" * 60 + "\n")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
