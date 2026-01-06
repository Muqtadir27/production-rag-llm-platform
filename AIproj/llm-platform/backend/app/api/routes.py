from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.rag_pipeline import run_rag_pipeline

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


class AnswerResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        result = run_rag_pipeline(request.question)

        return {
            "answer": result["answer"],
            "sources": result.get("sources", [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
