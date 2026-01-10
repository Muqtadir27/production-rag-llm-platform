#!/usr/bin/env python
"""
Simple HTTP server for RAG - bypasses FastAPI complexity
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

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
    print(f"✗ Failed to load RAG: {e}")
    sys.exit(1)

class RAGRequestHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        """Handle GET requests"""
        path = urlparse(self.path).path
        
        if path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "name": "NeuroCore RAG API",
                "status": "ready",
                "endpoints": {
                    "query": "POST /api/query",
                    "status": "GET /api/status"
                }
            }
            self.wfile.write(json.dumps(response).encode())
            
        elif path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                stats = rag.get_statistics()
                response = {
                    "status": "ready",
                    "documents": stats['vector_store']['total_documents'],
                    "embedding_model": stats['embedding_model'],
                    "llm_model": stats['llm_model']
                }
            except Exception as e:
                response = {"status": "error", "message": str(e)}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        path = urlparse(self.path).path
        
        if path == '/api/query':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                data = json.loads(body.decode())
                
                question = data.get('question', '')
                top_k = data.get('top_k', 3)
                
                if not question:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Missing question"}).encode())
                    return
                
                # Query RAG
                result = rag.query(question, top_k=top_k)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
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
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{self.client_address[0]}] {format % args}")

if __name__ == "__main__":
    server_address = ("0.0.0.0", 8000)
    httpd = HTTPServer(server_address, RAGRequestHandler)
    print("="*60)
    print("HTTP Server running on http://0.0.0.0:8000")
    print("="*60 + "\n")
    print("Endpoints:")
    print("  GET /                - API info")
    print("  GET /api/status      - Get system status")
    print("  POST /api/query      - Ask a question (JSON body with 'question' field)")
    print("\n" + "="*60 + "\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        sys.exit(0)
