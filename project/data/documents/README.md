"""
Example document for testing the RAG pipeline.
Replace this with your actual documents.
"""

# Introduction to NeuroCore RAG System

## What is NeuroCore?

NeuroCore is a production-grade Retrieval-Augmented Generation (RAG) system that combines the power of semantic search with large language models. It enables AI systems to answer questions based strictly on provided documents, eliminating hallucinations and ensuring factual accuracy.

## Key Features

- **Document Ingestion**: Automatically processes PDF, TXT, and Markdown files
- **Semantic Chunking**: Intelligently splits documents while preserving context
- **Vector Embeddings**: Uses Sentence-Transformers for high-quality semantic embeddings
- **Fast Search**: FAISS-based vector database for sub-millisecond similarity search
- **Grounded Answers**: LLM generates responses only from retrieved context
- **Local Inference**: Runs entirely locally with no external API dependencies

## Architecture Components

### 1. Document Loader
Handles ingestion of various document formats including PDF, plain text, and markdown files.

### 2. Text Splitter
Splits documents into semantic chunks while preserving context and maintaining overlap for better retrieval.

### 3. Embedding Service
Generates semantic embeddings using Sentence-Transformers models for efficient similarity matching.

### 4. Vector Store
FAISS-based vector database that enables fast similarity search over millions of documents.

### 5. LLM Service
Uses HuggingFace Transformers (FLAN-T5) for local inference without external API calls.

### 6. Prompt Service
Handles prompt engineering to ensure answers are grounded in retrieved documents.

### 7. RAG Pipeline
Orchestrates all components into a complete pipeline for answering questions.

## How It Works

1. **Preprocessing**: Documents are loaded and split into meaningful chunks
2. **Embedding**: Each chunk is converted to a semantic embedding vector
3. **Storage**: Embeddings are stored in a FAISS vector database for fast retrieval
4. **Query**: User's question is embedded using the same embedding model
5. **Retrieval**: Top-K most similar documents are retrieved based on embedding similarity
6. **Generation**: Retrieved documents are passed as context to the LLM
7. **Response**: LLM generates an answer grounded in the retrieved context

## Why This Matters

Traditional LLM-based chatbots have several issues:
- **Hallucinations**: Generate false information not in training data
- **Lack of Specificity**: Can't access current or proprietary information
- **No Traceability**: Hard to verify where answers come from
- **Scalability Issues**: Don't scale to enterprise use cases

RAG solves these problems by:
- **Separating Retrieval from Generation**: Gets relevant info first, then answers
- **Grounding Answers**: All responses are based on provided documents
- **Traceability**: Can point to exact source documents
- **Scalability**: Works with documents of any size and frequency

## Use Cases

- **Customer Support**: Answer questions based on FAQ and documentation
- **Knowledge Management**: Query internal policies and procedures
- **Research**: Analyze large document collections
- **Compliance**: Ensure answers comply with organizational guidelines
- **Training**: Provide accurate information from training materials

## Getting Started

1. Place your documents in `data/documents/`
2. Run `python -m backend.app.services.test_rag`
3. The system will automatically:
   - Load documents
   - Split them into chunks
   - Generate embeddings
   - Build the vector index
   - Answer your queries

## Technical Stack

- **LangChain**: Document processing and pipeline orchestration
- **Sentence-Transformers**: Semantic embeddings (384-768 dimensions)
- **FAISS**: Vector similarity search
- **HuggingFace Transformers**: Local LLM inference (FLAN-T5)
- **PyPDF**: PDF document parsing
- **FastAPI**: REST API (optional)

## Performance Metrics

- **Search Latency**: < 10ms for queries
- **Embedding Generation**: ~100 documents/minute (CPU), ~1000/minute (GPU)
- **Memory**: Depends on document volume, typically 2-8GB for standard deployments
- **Accuracy**: Answers strictly from provided documents (no hallucinations)

## Future Enhancements

- REST API with FastAPI
- Streaming responses
- Authentication and rate limiting
- Support for multiple languages
- Cloud deployment options
- Integration with commercial LLMs

## Mohammed Abdul Muqtadir

AI & Data Science Engineer
- GitHub: https://github.com/Muqtadir27
- LinkedIn: https://linkedin.com/in/muqtadir27
