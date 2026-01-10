# 🎯 Complete NeuroCore RAG Setup & Troubleshooting

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│              http://localhost:3000/chat                  │
│  • React Component: app/chat/page.tsx                   │
│  • User types question → calls /api/query               │
│  • Displays LLM answer + sources + metrics              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST (JSON)
                     ↓
┌─────────────────────────────────────────────────────────┐
│                 API GATEWAY (Next.js API)                │
│             /app/api/query/route.ts                      │
│         • Receives question from frontend                │
│         • Proxies to Python backend                      │
│         • Returns formatted response                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST (JSON)
                     ↓
┌─────────────────────────────────────────────────────────┐
│                BACKEND (FastAPI + Python)                │
│              http://localhost:8000/api/query             │
│                                                         │
│  RAG Pipeline:                                          │
│  ┌──────────────┐                                       │
│  │   Question   │                                       │
│  └──────┬───────┘                                       │
│         ↓                                               │
│  ┌──────────────────┐                                   │
│  │ Vector Search    │ ← Queries FAISS index            │
│  │ (find relevant   │                                  │
│  │  documents)      │                                  │
│  └──────┬───────────┘                                   │
│         ↓                                               │
│  ┌──────────────────┐                                   │
│  │ Retrieve Top-K   │ (default: 3 documents)           │
│  │ Similar Chunks   │                                  │
│  └──────┬───────────┘                                   │
│         ↓                                               │
│  ┌──────────────────┐                                   │
│  │ LLM Generation   │ ← FLAN-T5 model                  │
│  │ (explain answer) │ ← Enhanced prompt with            │
│  │                  │   explanation instructions       │
│  └──────┬───────────┘                                   │
│         ↓                                               │
│  ┌──────────────────┐                                   │
│  │ Format Response  │ ← Add sources & confidence       │
│  │ with Sources     │                                  │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
         ↑                          ↑
         │                          │
    ┌────┴──────────────────────────┴────┐
    │  Services:                         │
    │  • document_loader.py              │
    │  • text_splitter.py                │
    │  • embeddings.py                   │
    │  • vector_store.py                 │
    │  • llm.py                          │
    │  • prompt.py (Enhanced)            │
    │  • rag_pipeline.py                 │
    │  • main.py (FastAPI)               │
    └────┬──────────────────────────────┘
         │
    ┌────┴──────────────────────────┐
    │  Knowledge Base:              │
    │  • data/documents/            │
    │  • data/vector_index/         │
    │  (FAISS embeddings)           │
    └───────────────────────────────┘
```

## 📋 Prerequisites

- **Python**: 3.10+ (Get from https://www.python.org/)
- **Node.js**: 16+ (Get from https://nodejs.org/)
- **RAM**: 8GB minimum
- **Disk**: 2GB for models
- **OS**: Windows, macOS, or Linux

## ✅ Step-by-Step Setup

### 1️⃣ Clone/Prepare Project
```bash
cd your-project-directory
```

### 2️⃣ Install Python Dependencies
```bash
pip install -r backend/requirements.txt
```

**Expected output:**
```
Successfully installed transformers torch sentence-transformers faiss-cpu pydantic fastapi uvicorn PyPDF2
```

### 3️⃣ Install Node Dependencies
```bash
npm install
```

**Expected output:**
```
added XXX packages
```

### 4️⃣ Create Data Directories
```bash
# Windows
mkdir data\documents

# macOS/Linux
mkdir -p data/documents
```

### 5️⃣ Add Documents
Copy your PDF, TXT, or Markdown files to `data/documents/`

Example:
```
data/documents/
├── machine_learning_guide.txt (included)
├── your_document.pdf
└── another_doc.md
```

### 6️⃣ Build Knowledge Base Index
```bash
python -m backend.app.services.test_rag
```

**Expected output:**
```
Loading documents from data/documents/...
Processing machine_learning_guide.txt...
Creating embeddings...
Building FAISS index...
Vector store created with X documents
```

### 7️⃣ Start Backend (Terminal 1)
```bash
python -m backend.app.main
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

### 8️⃣ Start Frontend (Terminal 2)
```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

### 9️⃣ Test the System
Open browser: **http://localhost:3000/chat**

Try asking:
```
What is machine learning?
```

Expected response:
```
Machine Learning is a subset of artificial intelligence (AI) that enables 
systems to learn and improve from experience without being explicitly programmed. 
In other words, ML systems can learn and adapt to new data without human intervention.

[Retrieved from machine_learning_guide.txt - Score: 0.89]
[Retrieved from machine_learning_guide.txt - Score: 0.85]
[Retrieved from machine_learning_guide.txt - Score: 0.82]
```

## 🐛 Troubleshooting Guide

### ❌ Error: `ModuleNotFoundError: No module named 'transformers'`

**Cause:** Python dependencies not installed

**Solution:**
```bash
pip install -r backend/requirements.txt
```

---

### ❌ Error: `CORS error` or `Failed to get response from RAG system`

**Cause:** Backend not running or not accessible

**Solution:**
1. Make sure backend is running:
```bash
python -m backend.app.main
```

2. Check the URL in `app/api/query/route.ts` is correct (default: http://localhost:8000)

3. Verify firewall isn't blocking port 8000

---

### ❌ Error: `No documents found in data/documents`

**Cause:** Documents not added or index not built

**Solution:**
1. Add documents to `data/documents/`

2. Rebuild the index:
```bash
python -m backend.app.services.test_rag
```

3. Restart backend:
```bash
python -m backend.app.main
```

---

### ❌ First query takes 1-2 minutes

**This is normal!** 

The system is:
- Loading the LLM model (FLAN-T5) into memory (~250MB)
- Creating embeddings for documents
- Running similarity search
- Generating response

Subsequent queries are much faster (~5-10 seconds).

**To speed up first query:**
- Use GPU (CUDA): Install `torch` with GPU support
- Pre-warm by making a dummy query during setup

---

### ❌ Error: `Port 8000 already in use`

**Cause:** Another process is using port 8000

**Solution:**
```bash
# Find what's using port 8000
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000

# Kill the process or change backend port in main.py:
# Change: port=8000 to port=8001
```

---

### ❌ Error: `Port 3000 already in use`

**Cause:** Another Next.js app is running

**Solution:**
```bash
# Run on different port
npm run dev -- -p 3001
```

---

### ❌ Chat page shows "Error" repeatedly

**Causes & Solutions:**

1. **Backend not running**
   ```bash
   python -m backend.app.main
   ```

2. **No documents loaded**
   - Add files to `data/documents/`
   - Rebuild: `python -m backend.app.services.test_rag`

3. **Browser cache issue**
   - Press Ctrl+Shift+Delete to clear cache
   - Or use Incognito mode

4. **CORS issue**
   - Make sure backend has CORS enabled (it does by default)
   - Check that `/api/query` endpoint exists:
     ```bash
     curl http://localhost:8000/api/query -X POST -H "Content-Type: application/json" -d '{"question":"test"}'
     ```

---

### ❌ Response is irrelevant to the question

**Cause:** Wrong documents retrieved or poor embeddings

**Solution 1:** Check retrieved documents
- Look at the sources shown in the response
- Are they relevant to your question?

**Solution 2:** Improve document quality
- Use well-structured, clear documents
- Avoid images (only text is indexed)

**Solution 3:** Adjust retrieval count
- In `app/chat/page.tsx`, change `top_k`:
```typescript
body: JSON.stringify({ question: userMessage.content, top_k: 5 })  // Try 5 instead of 3
```

**Solution 4:** Use better embedding model
- In `backend/app/services/embeddings.py`, change:
```python
# From:
model_name = "sentence-transformers/all-MiniLM-L6-v2"

# To:
model_name = "sentence-transformers/all-mpnet-base-v2"  # Better quality
```

---

### ❌ LLM response is cut off or incomplete

**Cause:** Max token limit reached

**Solution:** In `backend/app/services/llm.py`:
```python
# Increase max_length:
max_length=200  # Change to 300 or 400
```

---

### ❌ Out of memory error

**Cause:** LLM model too large for available RAM

**Solution 1:** Use smaller model
```python
# In backend/app/services/llm.py:
# From:
model_name = "google/flan-t5-base"  # 250MB

# To:
model_name = "google/flan-t5-small"  # 80MB
```

**Solution 2:** Use GPU
- Install GPU PyTorch:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

---

### ❌ Embeddings error or vector store issue

**Solution:** Rebuild from scratch
```bash
# Delete old index
rmdir /s data\vector_index  # Windows
rm -rf data/vector_index    # macOS/Linux

# Rebuild
python -m backend.app.services.test_rag
```

---

## 🔧 Performance Tuning

### Make Response Faster

1. **Reduce retrieved documents:**
```typescript
top_k: 1  // Get only top document
```

2. **Use smaller LLM:**
```python
"google/flan-t5-small"  # Faster inference
```

3. **Reduce document chunks:**
```python
chunk_size=256  # Smaller chunks = faster search
```

4. **Use GPU** (if available)
```bash
# Install GPU PyTorch
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

### Make Answers Better

1. **Retrieve more documents:**
```typescript
top_k: 5  // Get top 5 documents
```

2. **Use larger LLM:**
```python
"google/flan-t5-large"  # Slower but better answers
```

3. **Use better embeddings:**
```python
"sentence-transformers/all-mpnet-base-v2"
```

4. **Improve documents:**
   - Use well-structured text
   - Clear paragraphs and sections
   - Avoid images and complex formatting

---

## 🧪 Testing the Integration

### Test Backend Directly
```bash
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?", "top_k": 3}'
```

### Test Status Endpoint
```bash
curl "http://localhost:8000/api/status"
```

### View API Documentation
Open: **http://localhost:8000/docs**

---

## 📊 Monitoring & Logs

### Backend Logs
The terminal running `python -m backend.app.main` shows all API requests and errors

### Frontend Logs
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see `/api/query` requests

### Check System Status
```bash
curl http://localhost:8000/api/status | python -m json.tool
```

Example output:
```json
{
  "status": "ready",
  "documents": 5,
  "embedding_model": "all-MiniLM-L6-v2",
  "llm_model": "flan-t5-base"
}
```

---

## 🚀 Advanced Usage

### Using Custom Prompts
Edit `backend/app/services/prompt.py` to customize:
- Response tone (more formal, casual, technical, etc.)
- Instructions (add domain-specific guidance)
- Output format (change how sources are cited)

### Adding More Documents
1. Copy files to `data/documents/`
2. Rebuild index:
```bash
python -m backend.app.services.test_rag
```

### Using Different Embedding Models
```python
# In backend/app/services/embeddings.py:

# Fast, good quality (default)
"sentence-transformers/all-MiniLM-L6-v2"

# Better quality
"sentence-transformers/all-mpnet-base-v2"

# Best quality
"sentence-transformers/all-mpnet-base-v2"

# Multilingual
"sentence-transformers/multilingual-MiniLM-L12-v2"
```

### Using Different LLM Models
```python
# In backend/app/services/llm.py:

# Fast, good quality (default)
"google/flan-t5-base"

# Better quality, slower
"google/flan-t5-large"

# Best quality, very slow
"google/flan-t5-xl"
```

---

## ✨ Tips for Best Results

1. **Quality Documents**: Better documents = Better answers
2. **Clear Questions**: Be specific in your queries
3. **Right Model Size**: Balance between speed and quality
4. **Patience on First Query**: First run loads models into memory
5. **Monitor Logs**: Check logs if something seems wrong

---

## 📞 Need More Help?

1. Check the Troubleshooting section above
2. Verify both backend and frontend are running
3. Check browser console for errors (F12)
4. Review backend logs (terminal output)
5. Try a fresh rebuild: Delete `data/vector_index/` and rebuild

---

**You're all set! Happy querying! 🎉**
