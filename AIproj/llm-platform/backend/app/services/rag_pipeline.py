from typing import List, Optional, Dict

from backend.app.services.document_loader import load_documents_from_folder
from backend.app.services.text_splitter import split_documents
from backend.app.services.embeddings import EmbeddingService
from backend.app.services.vector_store import FAISSVectorStore
from backend.app.services.prompt import build_prompt
from backend.app.services.llm import LLMService


DATA_DIR = "data/documents"


class RAGPipeline:
    """
    Stable, production-safe RAG pipeline
    """

    def __init__(self):
        self.embedder = EmbeddingService()
        self.llm = LLMService()

        self.chunks: List = []
        self.texts: List[str] = []
        self.store: Optional[FAISSVectorStore] = None

        self._build_index()

    # =========================
    # INDEX MANAGEMENT
    # =========================

    def _build_index(self):
        docs = load_documents_from_folder(DATA_DIR)
        chunks = split_documents(docs)

        self.chunks = chunks
        self.texts = [chunk.page_content for chunk in chunks]

        if not self.texts:
            self.store = None
            return

        vectors = self.embedder.embed_texts(self.texts)

        # ✅ positional argument ONLY
        self.store = FAISSVectorStore(len(vectors[0]))
        self.store.add_vectors(vectors, self.texts)

    def rebuild(self):
        self._build_index()

    def reset(self):
        self.chunks = []
        self.texts = []
        self.store = None

    # =========================
    # RETRIEVAL
    # =========================

    def retrieve(self, query: str, k: int = 3):
        if not self.store or not self.texts:
            return []

        query_vector = self.embedder.embed_query(query)
        retrieved_texts = self.store.search(query_vector, k=k)

        return [
            chunk for chunk in self.chunks
            if chunk.page_content in retrieved_texts
        ]

    # =========================
    # GENERATION
    # =========================

    def generate_answer(
        self,
        query: str,
        retrieved_chunks,
        chat_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        context_texts = [chunk.page_content for chunk in retrieved_chunks]

        prompt = build_prompt(
            context_chunks=context_texts,
            question=query,
            chat_history=chat_history,
        )

        return self.llm.generate(prompt)

    # =========================
    # FULL PIPELINE
    # =========================

    def run(
        self,
        question: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        k: int = 3,
    ):
        question = question.strip()

        if not question:
            return {
                "answer": "Please ask a valid question.",
                "sources": [],
            }

        retrieved_chunks = self.retrieve(question, k=k)

        if not retrieved_chunks:
            return {
                "answer": (
                    "I couldn’t find relevant information in the documents for that question. "
                    "Try asking about skills, projects, education, or experience."
                ),
                "sources": [],
            }

        answer = self.generate_answer(
            query=question,
            retrieved_chunks=retrieved_chunks,
            chat_history=chat_history,
        )

        sources = list(
            {chunk.metadata.get("source", "unknown") for chunk in retrieved_chunks}
        )

        return {
            "answer": answer,
            "sources": sources,
        }


# =========================
# SINGLETON INSTANCE
# =========================

rag_pipeline = RAGPipeline()


# =========================
# FASTAPI ENTRY POINT
# =========================

def run_rag_pipeline(
    question: str,
    history: Optional[List[Dict[str, str]]] = None,
    k: int = 3,
):
    return rag_pipeline.run(
        question=question,
        chat_history=history,
        k=k,
    )
