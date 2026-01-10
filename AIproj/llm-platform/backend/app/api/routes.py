from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import shutil

from backend.app.services.rag_pipeline import (
    run_rag_pipeline,
    rag_pipeline,
)

router = APIRouter()

UPLOAD_DIR = "data/documents"
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md", ".json"}


# =========================
# MODELS
# =========================

class QuestionRequest(BaseModel):
    question: str
    history: Optional[List[Dict[str, str]]] = None


class AnswerResponse(BaseModel):
    answer: str
    sources: List[str]


# =========================
# HEALTH CHECK
# =========================

@router.get("/status")
def status():
    return {
        "status": "online",
        "rag_ready": True,
        "documents_loaded": len(rag_pipeline.chunks),
    }


# =========================
# ASK (RAG CHAT)
# =========================

@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        result = run_rag_pipeline(
            question=request.question,
            history=request.history or [],
        )

        return AnswerResponse(
            answer=result["answer"],
            sources=result.get("sources", []),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"RAG processing error: {str(e)}",
        )


# =========================
# DOCUMENT UPLOAD
# =========================

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document and rebuild the RAG index
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 🔁 Rebuild FAISS index safely
        rag_pipeline.rebuild()

        return {
            "message": "File uploaded and indexed successfully",
            "filename": file.filename,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}",
        )


# =========================
# RESET INDEX
# =========================

@router.post("/reset-index")
def reset_index():
    """
    Clear FAISS index and memory
    """
    try:
        rag_pipeline.reset()
        return {
            "message": "RAG index reset successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Reset failed: {str(e)}",
        )
