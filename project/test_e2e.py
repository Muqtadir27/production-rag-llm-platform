#!/usr/bin/env python
"""
End-to-end test of the RAG system
"""
import subprocess
import json

print("\n" + "="*60)
print("RAG END-TO-END TEST")
print("="*60 + "\n")

# Test 1: Direct RAG query
print("1. Testing Direct RAG Query Script...")
try:
    result = subprocess.run(
        ["python", "-m", "backend.app.services.rag_query", "What is AI?", "2"],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if result.returncode == 0:
        data = json.loads(result.stdout)
        print(f"   Status: {data.get('status')}")
        print(f"   Answer: {data.get('answer', 'N/A')[:80]}...")
        print(f"   Retrieved: {len(data.get('retrieved_documents', []))} documents")
        print("   ✓ PASS\n")
    else:
        print(f"   ✗ FAIL: Return code {result.returncode}")
        print(f"   Error: {result.stderr}\n")
except Exception as e:
    print(f"   ✗ FAIL: {e}\n")

# Test 2: Next.js API endpoint
print("2. Testing Next.js API Endpoint...")
try:
    result = subprocess.run(
        ["powershell", "-Command", 
         "$body = @{question='What is machine learning?'} | ConvertTo-Json; " +
         "(Invoke-WebRequest -Uri 'http://localhost:3001/api/query' -Method Post " +
         "-Body $body -ContentType 'application/json' -UseBasicParsing).Content"],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if result.returncode == 0:
        data = json.loads(result.stdout)
        print(f"   Status: {data.get('status')}")
        print(f"   Answer: {data.get('answer', 'N/A')[:80]}...")
        print("   ✓ PASS\n")
    else:
        print(f"   ✗ FAIL: Return code {result.returncode}")
        print(f"   Error: {result.stderr}\n")
except Exception as e:
    print(f"   ✗ FAIL: {e}\n")

print("="*60)
print("END-TO-END TEST COMPLETE")
print("="*60 + "\n")
