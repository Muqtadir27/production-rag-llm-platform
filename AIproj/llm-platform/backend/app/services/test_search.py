from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents
from backend.app.services.embeddings import EmbeddingService
from backend.app.services.similarity import find_top_k

docs = load_documents_from_folder("data/documents")
chunks = split_documents(docs)

texts = [chunk.page_content for chunk in chunks]

embedder = EmbeddingService()
vectors = embedder.embed_texts(texts)

query = "machine learning and python experience"
query_vector = embedder.embed_query(query)

results = find_top_k(query_vector, vectors, texts, k=3)

print("Top matching chunks:\n")
for score, text in results:
    print(f"Score: {score:.4f}")
    print(text[:300])
    print("-----")
