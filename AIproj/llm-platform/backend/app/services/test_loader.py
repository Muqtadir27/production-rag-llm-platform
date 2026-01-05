from backend.app.services.document_loader import load_documents_from_folder

docs = load_documents_from_folder("data/documents")

print(f"Loaded {len(docs)} document pages")

for doc in docs[:2]:
    print("-----")
    print(doc.page_content[:300])
