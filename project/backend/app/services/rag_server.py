#!/usr/bin/env python
"""
Persistent RAG Server
Keeps models in memory to avoid reload overhead on each query
Uses a simple JSON socket API
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import sys
import json
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.app.services.rag_pipeline import RAGPipeline

# Global RAG instance - loaded once
rag = None

def initialize_rag():
    """Initialize RAG pipeline once and keep in memory"""
    global rag
    if rag is None:
        logger.info("Initializing RAG pipeline...")
        rag = RAGPipeline(
            documents_dir="data/documents",
            index_path="data/vector_index"
        )
        logger.info("RAG pipeline initialized and ready!")
    return rag

def handle_query(question: str, top_k: int = 3) -> dict:
    """Process a query using the persistent RAG instance with robust error handling"""
    try:
        if not question or not question.strip():
            return {
                "question": question,
                "answer": "Please provide a valid question.",
                "status": "error",
                "retrieved_documents": []
            }
        
        rag_instance = initialize_rag()
        result = rag_instance.query(question, top_k=min(max(top_k, 1), 10))
        
        # Convert float32 to float for JSON serialization
        def convert_floats(obj):
            if hasattr(obj, 'item'):  # numpy scalar
                return float(obj)
            elif isinstance(obj, dict):
                return {k: convert_floats(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_floats(item) for item in obj]
            return obj
        
        result = convert_floats(result)
        
        # Ensure all required fields are present
        return {
            "question": result.get('question', question),
            "answer": result.get('answer', 'No answer generated'),
            "status": result.get('status', 'unknown'),
            "retrieved_documents": result.get('retrieved_documents', [])
        }
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        logger.error(f"Query processing error: {e}\n{error_trace}")
        
        # Provide more helpful error messages
        error_msg = str(e).lower()
        
        if 'no documents' in error_msg or 'no vector store' in error_msg or 'empty' in error_msg:
            answer = "I don't have any documents loaded yet. Please upload documents first before asking questions."
        elif 'model' in error_msg and ('load' in error_msg or 'not found' in error_msg):
            answer = "The language model failed to load. Please check that all dependencies are installed correctly."
        elif 'embedding' in error_msg or 'vector' in error_msg:
            answer = "There was an issue with the document embeddings. Please try rebuilding the index."
        else:
            # For other errors, try to provide a partial answer if possible
            answer = f"I encountered an issue processing your question: {str(e)[:100]}. Please try rephrasing or ensure documents are properly uploaded and indexed."
        
        return {
            "question": question,
            "answer": answer,
            "status": "error",
            "retrieved_documents": [],
            "error_details": str(e)
        }

if __name__ == "__main__":
    # Read from stdin with comprehensive error handling
    try:
        input_data = sys.stdin.read()
        
        if not input_data.strip():
            print(json.dumps({
                "error": "No input received",
                "status": "error"
            }))
            sys.exit(1)
        
        try:
            request = json.loads(input_data)
        except json.JSONDecodeError as e:
            print(json.dumps({
                "error": f"Invalid JSON: {str(e)}",
                "status": "error"
            }))
            sys.exit(1)
        
        question = request.get('question', '').strip()
        top_k = request.get('top_k', 3)
        
        if not question:
            result = {
                "error": "Question is required",
                "status": "error"
            }
        else:
            result = handle_query(question, top_k)
        
        # Output as valid JSON (single line)
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Fatal error in rag_server: {e}", exc_info=True)
        # Always output valid JSON
        try:
            print(json.dumps({
                "error": "Internal server error",
                "status": "error",
                "details": str(e)
            }))
        except:
            # Last resort: output minimal valid JSON
            print('{"error":"Fatal error","status":"error"}')
        sys.exit(1)
