from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents
from backend.app.services.embeddings import EmbeddingService
from backend.app.services.vector_store import FAISSVectorStore
from backend.app.services.prompt import build_prompt
from backend.app.services.llm import LLMService


class RAGPipeline:
    def __init__(self):
        self.embedder = EmbeddingService()
        self.llm = LLMService()

        docs = load_documents_from_folder("data/documents")
        chunks = split_documents(docs)

        self.texts = [chunk.page_content for chunk in chunks]
        vectors = self.embedder.embed_texts(self.texts)

        self.store = FAISSVectorStore(len(vectors[0]))
        self.store.add_vectors(vectors, self.texts)

    def ask(self, query, k=3):
        query_vector = self.embedder.embed_query(query)
        retrieved_chunks = self.store.search(query_vector, k=k)

        prompt = build_prompt(retrieved_chunks, query)
        answer = self.llm.generate(prompt)

        return answer
