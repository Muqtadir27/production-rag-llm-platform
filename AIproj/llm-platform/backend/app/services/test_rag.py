from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline()

question = "What skills does Mohammed Abdul Muqtadir have?"
answer = rag.ask(question)

print("QUESTION:")
print(question)

print("\nANSWER:")
print(answer)
