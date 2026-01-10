#!/usr/bin/env python
"""
HTTP server that calls external RAG script to avoid import issues
"""
import subprocess
import json
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import socketserver

# Set UTF-8 encoding for output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except:
        pass

print("\n" + "="*60)
print("Starting RAG HTTP Server (subprocess-based)")
print("="*60 + "\n")

class RAGHandler(BaseHTTPRequestHandler):
    
    def handle_one_request(self):
        """Override to catch all exceptions"""
        try:
            super().handle_one_request()
        except Exception as e:
            print(f"[ERROR in handle_one_request] {e}")
            import traceback
            traceback.print_exc()
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/' or path == '/api/status':
            # For status, run a simple query to verify RAG works
            try:
                result = subprocess.run(
                    [sys.executable, '-m', 'backend.app.services.rag_query', 'What is AI?', '1'],
                    cwd='c:\\Users\\DELL\\OneDrive\\Documents\\Rafay\\Projects\\project',
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    data = {"status": "ready", "message": "RAG system is operational"}
                else:
                    data = {"status": "error", "message": "RAG check failed"}
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            except Exception as e:
                self.send_error(500, str(e))
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
                self.wfile.write(json.dumps({"error": "No question provided"}).encode())
                return
            
            print(f"Processing query: {question[:50]}...")
            
            # Call RAG script
            try:
                result = subprocess.run(
                    [sys.executable, '-m', 'backend.app.services.rag_query', question, str(top_k)],
                    cwd='c:\\Users\\DELL\\OneDrive\\Documents\\Rafay\\Projects\\project',
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                
                print(f"RAG script returned code: {result.returncode}")
                
                if result.returncode == 0:
                    response = json.loads(result.stdout)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(response, indent=2).encode())
                    print("[OK] Query processed successfully")
                else:
                    error_msg = result.stderr if result.stderr else "RAG query failed"
                    print(f"[ERROR] RAG error: {error_msg}")
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": error_msg}).encode())
            
            except subprocess.TimeoutExpired:
                print("[ERROR] RAG query timed out")
                self.send_error(504, "RAG query timed out")
            except json.JSONDecodeError as e:
                print(f"[ERROR] JSON decode error: {e}")
                self.send_error(500, f"Invalid response from RAG: {e}")
            
        except Exception as e:
            print(f"[ERROR] POST handler error: {e}")
            import traceback
            traceback.print_exc()
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Actually log errors
        if 'error' in format.lower() or 'exception' in format.lower():
            print(f"[HTTP] {format % args}")
        pass  # Suppress other logs

if __name__ == "__main__":
    try:
        # Set allow_reuse_address to avoid "Address already in use" errors
        HTTPServer.allow_reuse_address = True
        
        server = HTTPServer(("0.0.0.0", 8000), RAGHandler)
        
        print("\n" + "="*60)
        print("[OK] Server listening on http://0.0.0.0:8000")
        print("="*60)
        print("\nEndpoints:")
        print("  GET /api/status           - Check if RAG is ready")
        print("  POST /api/query           - Send a question (JSON body)")
        print("\nExample:")
        print('  curl -X POST http://localhost:8000/api/query \\')
        print('    -H "Content-Type: application/json" \\')
        print('    -d \'{"question":"What is machine learning?"}\' ')
        print("\n" + "="*60 + "\n")
        sys.stdout.flush()
        
        print("[DEBUG] Entering serve_forever()...")
        sys.stdout.flush()
        
        server.serve_forever()
        
        print("[DEBUG] serve_forever() returned")
        sys.stdout.flush()
    
    except KeyboardInterrupt:
        print("\n[OK] Server stopped (KeyboardInterrupt)")
        sys.exit(0)
    except SystemExit as e:
        print(f"\n[DEBUG] SystemExit: {e}")
        sys.exit(e.code if hasattr(e, 'code') else 1)
    except Exception as e:
        print(f"\n[ERROR] Server error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
