from fastapi import FastAPI
from backend.app.api.routes import router

app = FastAPI(
    title="Production RAG LLM Platform",
    description="Retrieval-Augmented Generation system for document-based Q&A",
    version="1.0.0"
)

app.include_router(router)


@app.get("/")
def health_check():
    return {"status": "LLM Platform backend is running"}
