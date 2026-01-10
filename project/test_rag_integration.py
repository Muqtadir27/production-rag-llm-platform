"""
Test script to verify RAG Q&A integration
Run this before starting the chat
"""

import subprocess
import time
import sys
import requests
from pathlib import Path

def check_backend():
    """Check if backend is running"""
    print("\n📡 Checking backend connection...")
    try:
        response = requests.get('http://localhost:8000/api/status', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is running!")
            print(f"   Documents indexed: {data.get('documents', 0)}")
            print(f"   Embedding model: {data.get('embedding_model', 'unknown')}")
            print(f"   LLM model: {data.get('llm_model', 'unknown')}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def check_documents():
    """Check if documents exist"""
    print("\n📚 Checking documents...")
    doc_dir = Path("data/documents")
    if not doc_dir.exists():
        print(f"❌ No documents directory found at {doc_dir}")
        return False
    
    files = list(doc_dir.glob("*"))
    if not files:
        print("❌ No documents in data/documents/")
        return False
    
    print(f"✅ Found {len(files)} file(s):")
    for f in files:
        print(f"   - {f.name}")
    return True


def test_query():
    """Test a sample query"""
    print("\n🧪 Testing sample query...")
    
    test_question = "What is in this document?"
    
    try:
        response = requests.post(
            'http://localhost:8000/api/query',
            json={"question": test_question, "top_k": 3},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Query successful!")
            print(f"\n📝 Question: {data.get('question')}")
            print(f"\n💭 Answer: {data.get('answer', 'No answer')[:200]}...")
            print(f"\n📄 Retrieved documents: {len(data.get('retrieved_documents', []))}")
            print(f"\n✨ Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Query failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Query timed out (LLM might be slow on first run)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("""
    ╔════════════════════════════════════════════════════╗
    ║   NeuroCore RAG Q&A - Integration Test             ║
    ╚════════════════════════════════════════════════════╝
    """)
    
    # Check documents
    docs_ok = check_documents()
    
    # Check backend
    backend_ok = check_backend()
    
    if backend_ok:
        # Test query
        query_ok = test_query()
        
        if query_ok:
            print("\n" + "="*50)
            print("✅ ALL TESTS PASSED!")
            print("="*50)
            print("\n🚀 You're ready to chat!")
            print("\nNext steps:")
            print("1. Open http://localhost:3000/chat")
            print("2. Ask questions about your documents")
            print("3. Watch the LLM generate grounded answers!")
            return 0
        else:
            print("\n⚠️  Backend is running but query test failed")
            print("Check that documents are indexed properly")
            return 1
    else:
        print("\n" + "="*50)
        print("❌ BACKEND NOT RUNNING")
        print("="*50)
        print("\nTo start the backend, run:")
        print("  python -m backend.app.main")
        print("\nMake sure to:")
        print("1. Install dependencies: pip install -r backend/requirements.txt")
        print("2. Add documents to: data/documents/")
        print("3. Build index: python -m backend.app.services.test_rag")
        return 1


if __name__ == "__main__":
    sys.exit(main())
