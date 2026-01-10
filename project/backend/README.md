# NeuroCore RAG - Backend Documentation

## Project Structure

```
project/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py                 # Main entry point & FastAPI app
│       └── services/
│           ├── __init__.py
│           ├── document_loader.py  # Load documents from disk
│           ├── text_splitter.py    # Split documents into chunks
│           ├── embeddings.py       # Generate semantic embeddings
│           ├── vector_store.py     # FAISS vector database
│           ├── llm.py              # Local LLM inference
│           ├── prompt.py           # Prompt engineering
│           ├── rag_pipeline.py     # Main RAG orchestrator
│           └── test_rag.py         # Test script
├── data/
│   └── documents/                  # Place your documents here
│       └── README.md               # Example document
├── requirements.txt                # Python dependencies
└── [rest of frontend code]
```

## Installation

### 1. Install Dependencies

```bash
cd project
pip install -r backend/requirements.txt
```

This will install:
- **transformers**: HuggingFace model hub & inference
- **torch**: PyTorch deep learning framework
- **sentence-transformers**: Embedding models
- **faiss-cpu**: Vector similarity search
- **PyPDF2**: PDF parsing
- **fastapi**: REST API framework (optional)

### 2. Prepare Documents

Place your documents in the `data/documents/` directory:

```
data/documents/
├── README.md                    # Example
├── my-document.pdf
├── another-document.txt
└── policy-guide.md
```

Supported formats:
- **.pdf** - PDF documents
- **.txt** - Plain text files
- **.md** - Markdown files

## Usage

### Quick Start - Test the System

```bash
python -m backend.app.services.test_rag
```

This will:
1. Load all documents from `data/documents/`
2. Build the vector index (if not exists)
3. Run example queries
4. Display answers with source documents

### Building the Knowledge Base Programmatically

```python
from backend.app.services.rag_pipeline import RAGPipeline

# Initialize
rag = RAGPipeline()

# Build index from documents
rag.build_index()

# Query
result = rag.query("What is the main topic?")
print(result['answer'])
```

### Querying the System

```python
from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline()

# Single query
result = rag.query(
    question="Your question here",
    top_k=3  # Number of documents to retrieve
)

print(f"Question: {result['question']}")
print(f"Answer: {result['answer']}")
print(f"Status: {result['status']}")
print(f"Retrieved Documents: {len(result['retrieved_documents'])}")

# Batch queries
results = rag.batch_query([
    "Question 1?",
    "Question 2?",
    "Question 3?"
])
```

### API Usage (FastAPI)

Uncomment the FastAPI section in `backend/app/main.py` and run:

```bash
python -m backend.app.main
```

Then access the API:

```bash
# Query endpoint
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "Your question?", "top_k": 3}'

# Status endpoint
curl "http://localhost:8000/api/status"

# Build knowledge base
curl -X POST "http://localhost:8000/api/build"
```

## Components Explained

### 1. Document Loader (`document_loader.py`)

Handles document ingestion:
- Loads PDF, TXT, and Markdown files
- Extracts text content
- Stores documents with metadata

```python
from backend.app.services.document_loader import DocumentLoader

loader = DocumentLoader("data/documents")
documents = loader.load_all_documents()
# Returns: [{'path': '...', 'content': '...', 'type': '.pdf', 'filename': '...'}]
```

### 2. Text Splitter (`text_splitter.py`)

Intelligently chunks documents:
- Preserves semantic boundaries
- Creates overlapping chunks for context
- Respects sentence boundaries

```python
from backend.app.services.text_splitter import TextSplitter

splitter = TextSplitter(chunk_size=512, chunk_overlap=50)
chunks = splitter.split_documents(documents)
# Returns: [{'content': '...', 'metadata': {...}}]
```

### 3. Embeddings (`embeddings.py`)

Generates semantic vectors:
- Uses Sentence-Transformers models
- Converts text to 384-768 dimensional vectors
- Enables semantic similarity search

```python
from backend.app.services.embeddings import EmbeddingService

embedder = EmbeddingService("all-MiniLM-L6-v2")
embedding = embedder.embed_text("Your text here")
# Returns: numpy array of shape (384,)
```

### 4. Vector Store (`vector_store.py`)

FAISS-based vector database:
- Stores embeddings efficiently
- Enables fast similarity search
- Persists to disk for reuse

```python
from backend.app.services.vector_store import VectorStore

store = VectorStore(embedding_dim=384)
store.add_embeddings(embeddings, documents)
results = store.search(query_embedding, top_k=3)
store.save()
```

### 5. LLM Service (`llm.py`)

Local LLM inference:
- Uses FLAN-T5 by default
- No external API calls
- Customizable temperature and sampling

```python
from backend.app.services.llm import LLMService

llm = LLMService("google/flan-t5-base")
response = llm.generate(
    prompt="Answer this question: ...",
    max_length=512,
    temperature=0.7
)
```

### 6. Prompt Service (`prompt.py`)

Prompt engineering:
- Creates grounded RAG prompts
- Ensures answers come from context
- Formats retrieved documents

```python
from backend.app.services.prompt import PromptService

prompt = PromptService.create_rag_prompt(
    query="Your question",
    context_documents=[...]
)
```

### 7. RAG Pipeline (`rag_pipeline.py`)

Main orchestrator:
- Combines all components
- Handles the complete workflow
- Provides simple query interface

```python
from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline()
rag.build_index()
result = rag.query("Your question?")
```

## Configuration

### Embedding Models

Available models (from Sentence-Transformers):

- **all-MiniLM-L6-v2** (default)
  - Dimensions: 384
  - Size: ~90MB
  - Speed: Very fast
  - Use: General purpose

- **all-mpnet-base-v2**
  - Dimensions: 768
  - Size: ~430MB
  - Speed: Moderate
  - Use: When higher accuracy is needed

- **multi-qa-MiniLM-L6-cos-v1**
  - Dimensions: 384
  - Size: ~90MB
  - Speed: Very fast
  - Use: Optimized for Q&A tasks

### LLM Models

Available models (from HuggingFace):

- **google/flan-t5-base** (default)
  - Parameters: 250M
  - Memory: ~3GB
  - Speed: Fast
  - Use: Balanced performance

- **google/flan-t5-small**
  - Parameters: 80M
  - Memory: ~1GB
  - Speed: Very fast
  - Use: Resource-constrained

- **google/flan-t5-large**
  - Parameters: 780M
  - Memory: ~7GB
  - Speed: Slower but more accurate
  - Use: Higher quality responses

## Performance Tuning

### Speed Optimization
- Use smaller embedding model (all-MiniLM-L6-v2)
- Use smaller LLM (flan-t5-small)
- Increase chunk_overlap to reduce retrieval calls
- Use GPU for embeddings and LLM

### Accuracy Optimization
- Use larger embedding model (all-mpnet-base-v2)
- Use larger LLM (flan-t5-large)
- Decrease chunk_size for more specific context
- Lower temperature in LLM for more deterministic answers

### Memory Optimization
- Use CPU for inference instead of GPU
- Reduce batch size for embedding
- Use smaller models
- Delete old vector indices

## Troubleshooting

### Issue: "No module named 'torch'"
**Solution**: Install PyTorch
```bash
pip install torch
```

### Issue: "CUDA out of memory"
**Solution**: Use CPU instead
```python
rag = RAGPipeline(...)
# Models will automatically use CPU
```

### Issue: "No documents found"
**Solution**: Place documents in `data/documents/`
```bash
mkdir -p data/documents
# Add your PDFs/TXTs/MDs here
```

### Issue: Poor answer quality
**Solution**:
1. Use larger embedding model
2. Use larger LLM
3. Lower temperature (more deterministic)
4. Provide more relevant documents
5. Improve document chunking

## Advanced Usage

### Custom Embedding Model

```python
from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline(
    embedding_model="all-mpnet-base-v2"  # More powerful
)
```

### Custom LLM Model

```python
from backend.app.services.rag_pipeline import RAGPipeline

rag = RAGPipeline(
    llm_model="google/flan-t5-large"  # Larger & slower
)
```

### Batch Processing

```python
questions = [
    "What is RAG?",
    "How does it work?",
    "What are the benefits?"
]

results = rag.batch_query(questions, top_k=3)

for result in results:
    print(f"Q: {result['question']}")
    print(f"A: {result['answer']}\n")
```

### Access Retrieved Documents

```python
result = rag.query("Your question?")

for doc in result['retrieved_documents']:
    print(f"Source: {doc['metadata']['source']}")
    print(f"Similarity: {doc['similarity']:.4f}")
    print(f"Content: {doc['content'][:100]}...")
```

## Production Deployment

### Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-m", "backend.app.main"]
```

### Cloud Deployment

The system is ready for:
- AWS EC2 / Lambda
- Google Cloud Run
- Azure Container Instances
- Render
- Heroku

Just wrap it in FastAPI and deploy!

## Monitoring & Logging

Logs are configured at INFO level. Check `app.log` for:
- Document loading progress
- Embedding generation
- Query processing
- Error messages

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Your message")
```

## Security Considerations

1. **Input Validation**: Validate user queries
2. **Rate Limiting**: Use FastAPI rate limiter
3. **Authentication**: Add API authentication
4. **Data Privacy**: Encrypt stored embeddings
5. **Access Control**: Restrict who can query

## Contributing

To extend the system:

1. Add new document formats in `document_loader.py`
2. Implement custom chunking in `text_splitter.py`
3. Add new embedding models in `embeddings.py`
4. Integrate new LLMs in `llm.py`
5. Create specialized prompts in `prompt.py`

## References

- [Sentence-Transformers](https://www.sbert.net/)
- [FAISS](https://github.com/facebookresearch/faiss)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers/)
- [LangChain](https://python.langchain.com/)
- [RAG Paper](https://arxiv.org/abs/2005.11401)

## License

MIT License - Free for commercial and personal use

## Author

Mohammed Abdul Muqtadir
- GitHub: https://github.com/Muqtadir27
- LinkedIn: https://linkedin.com/in/muqtadir27

---

**Happy RAGging! 🚀**
