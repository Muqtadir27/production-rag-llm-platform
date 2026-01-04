from fastapi import FastAPI

app = FastAPI(title="LLM Platform")

@app.get("/")
def health_check():
    return {"status": "LLM Platform backend is running"}
