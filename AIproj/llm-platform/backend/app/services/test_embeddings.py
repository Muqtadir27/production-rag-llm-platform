from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents
from backend.app.services.embeddings import EmbeddingService

docs = load_documents_from_folder("data/documents")
chunks = split_documents(docs)

texts = [chunk.page_content for chunk in chunks]

embedder = EmbeddingService()
vectors = embedder.embed_texts(texts)

print(f"Total vectors created: {len(vectors)}")
print(f"Vector dimension: {len(vectors[0])}")
