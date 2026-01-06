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

        # Load and prepare documents once (IMPORTANT for performance)
        docs = load_documents_from_folder("data/documents")
        chunks = split_documents(docs)

        self.chunks = chunks
        self.texts = [chunk.page_content for chunk in chunks]

        vectors = self.embedder.embed_texts(self.texts)

        self.store = FAISSVectorStore(len(vectors[0]))
        self.store.add_vectors(vectors, self.texts)

    def retrieve(self, query, k=3):
        query_vector = self.embedder.embed_query(query)
        retrieved_texts = self.store.search(query_vector, k=k)

        retrieved_chunks = []
        for chunk in self.chunks:
            if chunk.page_content in retrieved_texts:
                retrieved_chunks.append(chunk)

        return retrieved_chunks

    def generate_answer(self, query, retrieved_chunks):
        context_texts = [chunk.page_content for chunk in retrieved_chunks]
        prompt = build_prompt(context_texts, query)
        return self.llm.generate(prompt)


# 🔹 SINGLE PIPELINE INSTANCE (IMPORTANT)
rag_pipeline = RAGPipeline()


# 🔹 FUNCTION FASTAPI WILL CALL
def run_rag_pipeline(question: str, k: int = 3):
    retrieved_chunks = rag_pipeline.retrieve(question, k=k)

    if not retrieved_chunks:
        return {
            "answer": "I could not find relevant information in the provided documents.",
            "sources": []
        }

    answer = rag_pipeline.generate_answer(question, retrieved_chunks)

    sources = list(
        set(chunk.metadata.get("source", "unknown") for chunk in retrieved_chunks)
    )

    return {
        "answer": answer,
        "sources": sources
    }
