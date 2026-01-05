def build_prompt(context_chunks, query):
    context = "\n\n".join(context_chunks)

    prompt = f"""
You are an AI assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't know based on the provided documents."

Context:
{context}

Question:
{query}

Answer:
"""
    return prompt
