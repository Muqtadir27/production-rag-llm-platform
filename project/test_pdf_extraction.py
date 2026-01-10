#!/usr/bin/env python
"""Test PDF extraction"""
from backend.app.services.document_loader import DocumentLoader

loader = DocumentLoader('data/documents')
docs = loader.load_all_documents()

print(f"Total documents loaded: {len(docs)}")
print("\nDocuments:")
for doc in docs:
    print(f"- {doc['filename']} ({len(doc['content'])} chars)")
    
# Show resume content
print("\n" + "="*60)
print("RESUME CONTENT SAMPLE:")
print("="*60)
for doc in docs:
    if 'resume' in doc['filename'].lower():
        content = doc['content']
        print(content[:1500])
        print(f"\n... (Total: {len(content)} characters)")
        break
