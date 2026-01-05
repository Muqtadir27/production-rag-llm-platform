from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents
from backend.app.services.embeddings import EmbeddingService
from backend.app.services.vector_store import FAISSVectorStore

docs = load_documents_from_folder("data/documents")
chunks = split_documents(docs)

texts = [chunk.page_content for chunk in chunks]

embedder = EmbeddingService()
vectors = embedder.embed_texts(texts)

vector_dim = len(vectors[0])
store = FAISSVectorStore(vector_dim)

store.add_vectors(vectors, texts)

query = "python machine learning experience"
query_vector = embedder.embed_query(query)

results = store.search(query_vector, k=3)

print("Top FAISS results:\n")
for res in results:
    print(res[:300])
    print("-----")
