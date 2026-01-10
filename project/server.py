#!/usr/bin/env python
"""
Standalone RAG Server - Simple and Reliable
Uses ProcessPoolExecutor to avoid TensorFlow/TF-Keras import issues
"""

import os
import sys
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Suppress TensorFlow deprecation warnings on Windows to avoid inspect.stack() hang
import warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', category=PendingDeprecationWarning)

import logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)

def load_rag_and_serve():
    """Load RAG and run server in a subprocess to avoid import issues"""
    import json
    from http.server import HTTPServer, BaseHTTPRequestHandler
    from urllib.parse import urlparse
    
    print("\n" + "="*60)
    print("Loading RAG Pipeline...")
    print("="*60 + "\n")
    
    try:
        from backend.app.services.rag_pipeline import RAGPipeline
        rag = RAGPipeline(
            documents_dir="data/documents",
            index_path="data/vector_index"
        )
        print("✓ RAG Pipeline loaded successfully\n")
    except Exception as e:
        print(f"✗ Error loading RAG: {e}")
        sys.exit(1)
    
    class Handler(BaseHTTPRequestHandler):
        
        def do_GET(self):
            path = urlparse(self.path).path
            
            if path == '/' or path == '/api/status':
                try:
                    stats = rag.get_statistics()
                    data = {
                        "status": "ready",
                        "documents": stats['vector_store']['total_documents']
                    }
                except:
                    data = {"status": "error"}
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            else:
                self.send_error(404)
        
        def do_POST(self):
            if urlparse(self.path).path != '/api/query':
                self.send_error(404)
                return
            
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode()
                data = json.loads(body)
                
                question = data.get('question', '')
                top_k = data.get('top_k', 3)
                
                if not question:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "No question"}).encode())
                    return
                
                result = rag.query(question, top_k=top_k)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "question": result['question'],
                    "answer": result['answer'],
                    "status": result['status'],
                    "retrieved_documents": result['retrieved_documents']
                }
                self.wfile.write(json.dumps(response, indent=2).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
        
        def log_message(self, format, *args):
            return  # Suppress logs
    
    server = HTTPServer(("0.0.0.0", 8000), Handler)
    print("="*60)
    print("✓ Server running on http://localhost:8000")
    print("="*60)
    print("\nEndpoints:")
    print("  GET /api/status           - System status")
    print("  POST /api/query           - Ask a question")
    print("\nExample:")
    print('  curl -X POST http://localhost:8000/api/query \\')
    print('    -H "Content-Type: application/json" \\')
    print('    -d \'{"question":"What is machine learning?"}\'')
    print("\n" + "="*60 + "\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
        sys.exit(0)

if __name__ == "__main__":
    load_rag_and_serve()
