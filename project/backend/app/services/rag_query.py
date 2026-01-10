#!/usr/bin/env python
"""
Simple RAG query runner - can be called from HTTP server
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import sys
import json

# Load RAG
from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline(
    documents_dir="data/documents",
    index_path="data/vector_index"
)

# Parse command line arguments
if len(sys.argv) < 2:
    print(json.dumps({"error": "Usage: python rag_query.py '<question>' [top_k]"}))
    sys.exit(1)

question = sys.argv[1]
top_k = int(sys.argv[2]) if len(sys.argv) > 2 else 3

try:
    result = rag.query(question, top_k=top_k)
    
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
    
    output = {
        "question": result['question'],
        "answer": result['answer'],
        "status": result['status'],
        "retrieved_documents": result['retrieved_documents']
    }
    print(json.dumps(output))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
