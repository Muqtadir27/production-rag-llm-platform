#!/usr/bin/env python
"""
Hybrid approach: Run RAG in a subprocess to avoid import issues
Then communicate with it via HTTP
"""

import subprocess
import json
import sys
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import socket

# Check if port is in use
def port_in_use(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result == 0

print("\n" + "="*60)
print("Checking for port availability...")
print("="*60)

if port_in_use(8000):
    print("✗ Port 8000 is already in use")
    sys.exit(1)

# Start RAG in background process
print("\nStarting RAG subprocess...")
import os
rag_script = '''
import os
import json
import sys
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline(
    documents_dir="data/documents",
    index_path="data/vector_index"
)

print("RAG_READY", flush=True)

while True:
    try:
        line = input()
        request = json.loads(line)
        
        if request['action'] == 'query':
            result = rag.query(request['question'], top_k=request.get('top_k', 3))
            print(json.dumps({'status': 'success', 'result': result}))
        elif request['action'] == 'status':
            stats = rag.get_statistics()
            print(json.dumps({'status': 'success', 'result': stats}))
        else:
            print(json.dumps({'status': 'error', 'message': 'Unknown action'}))
    except Exception as e:
        print(json.dumps({'status': 'error', 'message': str(e)}))
        sys.stderr.flush()
    sys.stdout.flush()
'''

# Write script to temp file
with open('_rag_subprocess.py', 'w') as f:
    f.write(rag_script)

# Start subprocess
try:
    proc = subprocess.Popen(
        [sys.executable, '_rag_subprocess.py'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        cwd='c:\\Users\\DELL\\OneDrive\\Documents\\Rafay\\Projects\\project'
    )
    
    # Wait for ready message
    print("Waiting for RAG to initialize...")
    ready = proc.stdout.readline().strip()
    
    if ready != "RAG_READY":
        print(f"✗ RAG failed to initialize: {ready}")
        stdout, stderr = proc.communicate()
        print(f"STDERR: {stderr}")
        sys.exit(1)
    
    print("✓ RAG subprocess ready")
    
except Exception as e:
    print(f"✗ Failed to start RAG subprocess: {e}")
    sys.exit(1)

# Now run HTTP server that talks to the subprocess
class HTTPHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/api/status':
            try:
                proc.stdin.write(json.dumps({'action': 'status'}) + '\n')
                proc.stdin.flush()
                response_line = proc.stdout.readline()
                response = json.loads(response_line)
                
                if response['status'] == 'success':
                    data = response['result']
                    result = {
                        "status": "ready",
                        "documents": data['vector_store']['total_documents']
                    }
                else:
                    result = {"status": "error", "message": response.get('message')}
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
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
                self.send_error(400, "No question")
                return
            
            # Send to subprocess
            proc.stdin.write(json.dumps({'action': 'query', 'question': question, 'top_k': top_k}) + '\n')
            proc.stdin.flush()
            
            response_line = proc.stdout.readline()
            response = json.loads(response_line)
            
            if response['status'] == 'success':
                result = response['result']
                output = {
                    "question": result['question'],
                    "answer": result['answer'],
                    "status": result['status'],
                    "retrieved_documents": result['retrieved_documents']
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(output, indent=2).encode())
            else:
                self.send_error(500, response.get('message'))
        
        except Exception as e:
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        return  # Suppress logs

print("\n" + "="*60)
print("Starting HTTP server on http://0.0.0.0:8000")
print("="*60)

server = HTTPServer(("0.0.0.0", 8000), HTTPHandler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\n✓ Server stopped")
    proc.terminate()
    proc.wait()
