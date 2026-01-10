from typing import List, Dict


def build_prompt(
    context_chunks: List[str],
    question: str,
    chat_history: List[Dict[str, str]] | None = None,
) -> str:
    """
    Builds a grounded, hallucination-resistant prompt.
    """

    history_text = ""
    if chat_history:
        for turn in chat_history[-6:]:  # limit memory
            role = turn.get("role", "user")
            content = turn.get("content", "")
            history_text += f"{role.upper()}: {content}\n"

    context_text = "\n\n".join(context_chunks)

    prompt = f"""
You are a precise, professional AI assistant.
Answer ONLY using the provided context.
If the answer is not present, say you do not know.

Conversation history:
{history_text}

Context:
{context_text}

Question:
{question}

Answer:
""".strip()

    return prompt
