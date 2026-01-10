"""
Main entry point for RAG API
Can be extended with FastAPI for REST API
"""

import logging
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.services.rag_pipeline import RAGPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="NeuroCore RAG API",
    description="Production-Grade Retrieval-Augmented Generation System",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline globally (lazy initialization on first request)
rag_pipeline = None


def get_rag_pipeline():
    """Get or initialize RAG pipeline. Called lazily on first request."""
    global rag_pipeline
    if rag_pipeline is None:
        logger.info("Initializing RAG Pipeline on first request...")
        rag_pipeline = RAGPipeline(
            documents_dir="data/documents",
            index_path="data/vector_index"
        )
        logger.info("RAG Pipeline initialized successfully")
    return rag_pipeline


# Request/Response models
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3


class QueryResponse(BaseModel):
    question: str
    answer: str
    status: str
    retrieved_documents: List[Dict[str, Any]]
    latency: int = 0


class StatusResponse(BaseModel):
    status: str
    documents: int
    embedding_model: str
    llm_model: str


# API Endpoints
@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Query the RAG system with a question.
    
    Args:
        question: The question to ask
        top_k: Number of documents to retrieve (default: 3)
    
    Returns:
        QueryResponse with answer and retrieved documents
    """
    try:
        pipeline = get_rag_pipeline()
        result = pipeline.query(request.question, top_k=request.top_k)
        return QueryResponse(
            question=result['question'],
            answer=result['answer'],
            status=result['status'],
            retrieved_documents=result['retrieved_documents']
        )
    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Query error: {str(e)}")


@app.get("/api/status", response_model=StatusResponse)
async def status():
    """Get the status of the RAG system"""
    try:
        pipeline = get_rag_pipeline()
        stats = pipeline.get_statistics()
        return StatusResponse(
            status="ready",
            documents=stats['vector_store']['total_documents'],
            embedding_model=stats['embedding_model'],
            llm_model=stats['llm_model']
        )
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/api/build")
async def build_index():
    """Build the knowledge base from documents"""
    try:
        pipeline = get_rag_pipeline()
        success = pipeline.build_index()
        return {
            "status": "success" if success else "failed",
            "message": "Knowledge base built successfully" if success else "Failed to build knowledge base"
        }
    except Exception as e:
        logger.error(f"Error building index: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.get("/")
async def root():
    """API Root - Returns API information"""
    return {
        "name": "NeuroCore RAG API",
        "version": "1.0.0",
        "description": "Production-Grade Retrieval-Augmented Generation System",
        "endpoints": {
            "query": "POST /api/query - Ask a question",
            "status": "GET /api/status - Get system status",
            "build": "POST /api/build - Build knowledge base",
            "docs": "GET /docs - Swagger documentation",
            "redoc": "GET /redoc - ReDoc documentation"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
