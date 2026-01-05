from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents

docs = load_documents_from_folder("data/documents")
chunks = split_documents(docs)

print(f"Total chunks created: {len(chunks)}")

for i, chunk in enumerate(chunks[:3]):
    print(f"\n--- Chunk {i+1} ---")
    print(chunk.page_content)
