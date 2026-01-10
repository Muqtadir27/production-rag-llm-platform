#!/usr/bin/env python
"""Direct test of RAG pipeline - no FastAPI overhead"""

import sys
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    print("=" * 60)
    print("Testing RAG Pipeline Directly")
    print("=" * 60)
    
    print("\n1. Importing RAGPipeline...")
    from backend.app.services.rag_pipeline import RAGPipeline
    print("   ✓ Import successful")
    
    print("\n2. Initializing RAGPipeline...")
    start = time.time()
    pipeline = RAGPipeline(
        documents_dir="data/documents",
        index_path="data/vector_index"
    )
    init_time = time.time() - start
    print(f"   ✓ Pipeline initialized in {init_time:.2f}s")
    
    print("\n3. Getting statistics...")
    stats = pipeline.get_statistics()
    print(f"   ✓ Documents: {stats['vector_store']['total_documents']}")
    print(f"   ✓ Embedding model: {stats['embedding_model']}")
    print(f"   ✓ LLM model: {stats['llm_model']}")
    
    print("\n4. Running query: 'What is machine learning?'")
    start = time.time()
    result = pipeline.query("What is machine learning?", top_k=3)
    query_time = time.time() - start
    print(f"   ✓ Query completed in {query_time:.2f}s")
    print(f"\n   Status: {result['status']}")
    print(f"   Answer: {result['answer'][:150]}...")
    print(f"   Retrieved: {len(result['retrieved_documents'])} documents")
    
    print("\n" + "=" * 60)
    print("SUCCESS: RAG Pipeline works correctly!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ ERROR: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)
