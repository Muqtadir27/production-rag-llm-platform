#!/usr/bin/env python
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import sys

print("RAG Direct Test")
print("=" * 60)

try:
    print("\n1. Loading RAG Pipeline...")
    from backend.app.services.rag_pipeline import RAGPipeline
    
    print("2. Initializing...")
    rag = RAGPipeline(
        documents_dir="data/documents",
        index_path="data/vector_index"
    )
    print("   ✓ Initialized")
    
    print("\n3. Querying: 'What is machine learning?'")
    result = rag.query("What is machine learning?", top_k=3)
    
    print(f"\n   Status: {result['status']}")
    print(f"   Answer: {result['answer'][:100]}...")
    print(f"   Retrieved: {len(result['retrieved_documents'])} docs")
    
    print("\n✓ SUCCESS - RAG works!\n")
    
except Exception as e:
    print(f"\n✗ ERROR: {e}\n")
    import traceback
    traceback.print_exc()
    sys.exit(1)
