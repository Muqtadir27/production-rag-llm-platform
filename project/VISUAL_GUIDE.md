# 🎨 Visual Guide - NeuroCore RAG

## Expected Behavior

### ✅ Correct Setup (What You Should See)

#### 1. Backend Running
```
$ python -m backend.app.main

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

#### 2. Frontend Running
```
$ npm run dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

#### 3. Chat Page Loaded
```
Browser: http://localhost:3000/chat

┌─────────────────────────────────────────────────┐
│  NeuroCore RAG Chat                             │
│  ──────────────────────────────────────────     │
│                                                 │
│  [Chat messages appear here]                    │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Ask a question about your documents... │  │
│  └──────────────────┬───────────────────────┘  │
│                    [Send]                      │
└─────────────────────────────────────────────────┘
```

#### 4. Asking a Question
```
User: "What is machine learning?"

System: Processing...
       Retrieving relevant documents...
       Generating explanation...
```

#### 5. Expected Answer
```
✅ Response received!

ANSWER:
"Machine Learning is a subset of artificial intelligence (AI) 
that enables systems to learn and improve from experience without 
being explicitly programmed. In other words, ML systems can learn 
and adapt to new data without human intervention.

Machine learning uses algorithms and statistical models to analyze 
patterns in data. These algorithms can identify relationships between 
variables that humans might not easily detect. When exposed to more 
data, machine learning models can improve their accuracy and 
performance automatically."

RETRIEVED SOURCES:
✓ machine_learning_guide.txt (Score: 0.89) - 2.1s
✓ machine_learning_guide.txt (Score: 0.85) - 2.1s  
✓ machine_learning_guide.txt (Score: 0.82) - 2.1s
```

---

## ❌ Common Issues (What NOT to See)

### ❌ Error 1: Backend Not Running
```
Chat Response:
"Error: Failed to get response from RAG system.

Troubleshooting:
1. Ensure backend is running: python -m backend.app.main
2. Check that data/documents/ has files
3. Try rebuilding index: python -m backend.app.services.test_rag

Error details: [CONNECT_ECONNREFUSED] 127.0.0.1:8000"

FIX: Run in Terminal 1:
$ python -m backend.app.main
```

### ❌ Error 2: No Documents in Index
```
Chat Response:
"Error: No documents found in vector store"

FIX: 
1. Add documents to data/documents/
2. Rebuild index: python -m backend.app.services.test_rag
3. Restart backend
```

### ❌ Error 3: Vector Index Not Built
```
Chat Response:
"Error: Vector store not initialized"

FIX: Build index:
$ python -m backend.app.services.test_rag
```

### ❌ Error 4: Slow First Query
```
Chat Response: Takes 60-90 seconds for first query

WHY: Loading LLM model into memory (normal!)
     Subsequent queries: 5-10 seconds

OK TO WAIT! ⏳
```

---

## 📂 Directory Structure

### Before Setup
```
project/
├── app/
│   ├── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── api/
│   │   └── query/
│   │       └── route.ts
│   └── ...
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── document_loader.py
│   │   │   ├── text_splitter.py
│   │   │   ├── embeddings.py
│   │   │   ├── vector_store.py
│   │   │   ├── llm.py
│   │   │   ├── prompt.py
│   │   │   ├── rag_pipeline.py
│   │   │   ├── main.py
│   │   │   └── test_rag.py
│   │   └── __init__.py
│   └── requirements.txt
├── data/
│   ├── documents/     ← ADD YOUR FILES HERE
│   └── vector_index/  ← Created automatically
├── package.json
├── tsconfig.json
├── QUICK_START.md
├── SETUP_GUIDE.md
├── start_rag.bat      ← Windows users click this
└── start_rag.sh       ← macOS/Linux users run this
```

### After Setup
```
project/
├── ... (same as above)
├── data/
│   ├── documents/
│   │   ├── machine_learning_guide.txt  ← Sample
│   │   ├── your_document.pdf           ← Your files
│   │   └── another_doc.md              ← Your files
│   └── vector_index/
│       ├── index.faiss                 ← FAISS embeddings
│       └── metadata.json               ← Document info
└── ... (node_modules added)
```

---

## 🔄 Data Flow Diagram

### Step 1: Document Processing (One-time)
```
Your Documents
   ↓
data/documents/
   ├── file1.pdf
   ├── file2.txt
   └── file3.md
   ↓
[Document Loader - Load raw text]
   ↓
[Text Splitter - Break into 512-char chunks]
   ↓
[Embeddings - Convert text to 384-dimensional vectors]
   ↓
[Vector Store - Build FAISS index]
   ↓
data/vector_index/
   ├── index.faiss
   └── metadata.json
```

### Step 2: Query Processing (Every question)
```
User Question: "What is ML?"
   ↓
Frontend: app/chat/page.tsx
   ↓
Convert to embedding vector (384 dims)
   ↓
Search FAISS index: "Find 3 most similar chunks"
   ↓
Retrieved Chunks:
├── Chunk 1 (Score: 0.89)
├── Chunk 2 (Score: 0.85)
└── Chunk 3 (Score: 0.82)
   ↓
LLM (FLAN-T5): "Read chunks, explain what is ML"
   ↓
Return: Answer + Sources + Confidence
   ↓
Display in Chat: "Machine Learning is..."
```

---

## ⚡ Performance Timeline

### First Run (With Timestamps)
```
T+0s:    python -m backend.app.main
         → FastAPI server starts
         → CORS middleware configured

T+5s:    First user question received
         → Vector search: 50ms
         → LLM model loading: 45-60s ⏳
         → LLM inference: 30s ⏳
         → Response formatting: 100ms

T+95s:   Answer appears on screen ✅

T+100s:  Second question
         → Vector search: 50ms
         → LLM inference: 8s (model already loaded!)
         → Response formatting: 100ms

T+108s:  Answer appears ✅ (Much faster!)
```

### Subsequent Runs
```
T+0s:    python -m backend.app.main
         → FastAPI server starts
         → CORS middleware configured
         → Loads persisted FAISS index (3-5s)
         → Models already downloaded

T+10s:   Ready for queries

T+15s:   First question
         → Vector search: 50ms
         → LLM inference: 5-10s
         → Total: ~11s ✅

T+30s:   Second question
         → Total: ~11s ✅
```

---

## 🎯 Success Checklist

Before asking questions, verify:

- [ ] Python installed (python --version)
- [ ] Node.js installed (node --version)
- [ ] Dependencies installed (pip install -r backend/requirements.txt)
- [ ] Documents in data/documents/
- [ ] Index built (python -m backend.app.services.test_rag)
- [ ] Backend running (python -m backend.app.main)
  - Should see: "Uvicorn running on http://0.0.0.0:8000"
- [ ] Frontend running (npm run dev)
  - Should see: "Local: http://localhost:3000"
- [ ] Can access http://localhost:3000/chat
- [ ] Chat page loads without errors

Once all checked: **You're ready to ask questions!**

---

## 🔗 Important URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Chat | http://localhost:3000/chat | Ask questions |
| Frontend | http://localhost:3000 | Home page with orbiting balls |
| Backend API | http://localhost:8000 | RAG API endpoints |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| API ReDoc | http://localhost:8000/redoc | ReDoc documentation |

---

## 📱 Response Format Example

### Your Question
```
User Input: "What is machine learning and why is it important?"
```

### System Processing
```
Step 1: Convert question to embedding
        "What is machine learning..." → [0.12, 0.34, -0.21, ...]

Step 2: Search vector index
        Find 3 most similar document chunks

Step 3: Retrieve context
        Chunk 1: "Machine Learning is a subset of artificial intelligence..."
        Chunk 2: "Machine learning is important because..."
        Chunk 3: "ML uses algorithms and statistical models..."

Step 4: Generate explanation
        LLM reads chunks + question
        Creates detailed explanation

Step 5: Format response
        Add citations, scores, timing
```

### Chat Display
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│ Q: What is machine learning and why is it          │
│    important?                                       │
│                                                     │
│ A: Machine Learning is a subset of artificial      │
│    intelligence (AI) that enables systems to       │
│    learn and improve from experience without       │
│    being explicitly programmed. In other words,    │
│    ML systems can learn and adapt to new data      │
│    without human intervention.                      │
│                                                     │
│    Machine learning is important because it can    │
│    identify relationships between variables that    │
│    humans might not easily detect, automatically    │
│    improving performance as it's exposed to more    │
│    data.                                            │
│                                                     │
│  ─────────────────────────────────────────────    │
│  SOURCES:                                          │
│  ✓ machine_learning_guide.txt (0.89) - 2.1s      │
│  ✓ machine_learning_guide.txt (0.85) - 2.1s      │
│  ✓ machine_learning_guide.txt (0.82) - 2.1s      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps After Setup

1. **Explore with sample document**
   - Sample ML guide included
   - Try: "What is supervised learning?"

2. **Add your own documents**
   - Place in data/documents/
   - Rebuild index
   - Ask questions about them

3. **Customize prompts**
   - Edit backend/app/services/prompt.py
   - Change tone, add instructions
   - Restart backend to apply

4. **Explore API**
   - Visit http://localhost:8000/docs
   - Try API endpoints directly
   - Understand request/response format

5. **Performance tuning**
   - Adjust top_k for more/fewer sources
   - Try different LLM models
   - Use GPU if available

---

**Ready? Start with QUICK_START.md! 🎉**
