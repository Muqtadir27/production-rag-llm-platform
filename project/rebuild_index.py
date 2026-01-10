#!/usr/bin/env python
"""
Quick rebuild index script
"""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app.services.rag_pipeline import RAGPipeline

print("Starting index rebuild...")
try:
    rag = RAGPipeline(documents_dir='data/documents', index_path='data/vector_index')
    print("RAG pipeline created")
    
    success = rag.build_index()
    
    if success:
        stats = rag.get_statistics()
        print(f"[OK] Index built successfully!")
        print(f"Vector store stats: {stats['vector_store']}")
    else:
        print("[ERROR] Index build failed")
        sys.exit(1)
except Exception as e:
    print(f"[ERROR] {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
