from transformers import pipeline


class LLMService:
    def __init__(self, model_name="google/flan-t5-base"):
        self.pipe = pipeline(
            task="text2text-generation",
            model=model_name,
            max_length=256
        )

    def generate(self, prompt: str) -> str:
        output = self.pipe(prompt)
        return output[0]["generated_text"]
