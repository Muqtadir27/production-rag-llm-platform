# 🚀 How to Get RAG Q&A Working

## The Problem
Your chat was showing retrieved documents instead of LLM-generated answers.

## The Solution
I've set up a complete integration between your Next.js frontend and Python RAG backend!

---

## ✅ What I've Fixed

### 1. **Updated Chat Page** (`app/chat/page.tsx`)
- Now calls your RAG backend via `/api/query`
- Displays the **LLM-generated answer** prominently
- Shows retrieved source documents below
- Displays query latency and metrics

### 2. **Created API Endpoint** (`app/api/query/route.ts`)
- Next.js API route that proxies to Python backend
- Handles errors gracefully
- Works at `http://localhost:3000/api/query`

### 3. **Enabled FastAPI** (`backend/app/main.py`)
- Full REST API implementation
- CORS enabled for frontend access
- Proper request/response models
- Ready to run at `http://localhost:8000`

---

## 🎯 How It Works Now

```
User Types Question
        ↓
Chat Page Calls: /api/query (Next.js)
        ↓
Next.js API calls: http://localhost:8000/api/query (Python)
        ↓
Python RAG Pipeline:
  1. Embeds the question
  2. Retrieves relevant documents
  3. Sends to LLM with context
  4. LLM generates grounded answer
        ↓
Response comes back with:
  - LLM-generated ANSWER (displayed in chat)
  - Retrieved documents (shown as sources)
  - Query latency and metrics
```

---

## 🚀 How to Run

### Step 1: Terminal 1 - Start Python RAG Backend

```bash
cd c:\Users\DELL\OneDrive\Documents\Rafay\Projects\project

# Install dependencies (if not done)
pip install -r backend/requirements.txt

# Start the backend
python -m backend.app.main
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Terminal 2 - Start Next.js Frontend

```bash
cd c:\Users\DELL\OneDrive\Documents\Rafay\Projects\project

# Install dependencies (if not done)
npm install

# Start the frontend
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
Local:  http://localhost:3000
```

### Step 3: Add Documents (Important!)

```bash
mkdir -p data/documents

# Place your PDF, TXT, or MD files in:
# c:\Users\DELL\OneDrive\Documents\Rafay\Projects\project\data\documents\
```

### Step 4: Build the Index

In Python terminal:
```bash
python -m backend.app.services.test_rag
```

This will:
- Load all documents from `data/documents/`
- Create embeddings
- Build the vector index
- Ready for Q&A

### Step 5: Open Chat

Go to: http://localhost:3000/chat

**Now ask questions!** 🎉

---

## 🔄 The Flow

1. **You ask:** "What does the document contain?"
2. **Chat page sends** to `/api/query` (Next.js)
3. **Next.js forwards** to backend (Python RAG)
4. **RAG backend:**
   - Embeds your question
   - Searches vector database
   - Retrieves 3 most relevant chunks
   - Sends to FLAN-T5 LLM with context
   - LLM generates answer from context
5. **Response comes back:**
   - **Answer:** "According to the document, it covers..."
   - **Sources:** 3 document chunks with similarity scores
   - **Metrics:** Latency (12ms), Retrieved docs (3)

---

## 📊 What You'll See in Chat

### User Message
```
"What are the key features?"
```

### NeuroCore Response
```
"Based on the document, the key features include:
1. High availability with failover
2. Automatic sharding and rebalancing
3. Sub-millisecond latency
..."

📚 RETRIEVED FROM 3 SOURCES:
├─ Source: System_Architecture.pdf (92.5% match)
│  "The system employs a two-tier failover strategy..."
│
├─ Source: System_Architecture.pdf (87.3% match)
│  "Synchronous replication commits writes to..."
│
└─ Source: System_Architecture.pdf (81.2% match)
   "Automatic shard rebalancing..."

⚡ QUERY LATENCY: 45ms
📄 RETRIEVED DOCUMENTS: 3
```

---

## 🐛 Troubleshooting

### "Failed to get response from RAG system"
**Solution:** Make sure Python backend is running:
```bash
python -m backend.app.main
```

### "No documents found"
**Solution:** Add documents to `data/documents/` and run:
```bash
python -m backend.app.services.test_rag
```

### "Connection refused on localhost:8000"
**Solution:** Backend not running. Start it in a terminal:
```bash
python -m backend.app.main
```

### "ModuleNotFoundError: No module named..."
**Solution:** Install dependencies:
```bash
pip install -r backend/requirements.txt
```

---

## 🔧 Configuration

### Change Embedding Model
Edit `backend/app/main.py`:
```python
rag_pipeline = RAGPipeline(embedding_model="all-mpnet-base-v2")
```

### Change LLM Model
```python
rag_pipeline = RAGPipeline(llm_model="google/flan-t5-large")
```

### Change Backend Port
```python
uvicorn.run(app, host="0.0.0.0", port=9000)  # Changed from 8000
```

Then in `app/api/query/route.ts`:
```typescript
const backendUrl = 'http://localhost:9000'
```

---

## 📈 What's Different Now

### Before ❌
- Chat showed raw retrieved documents
- No LLM-generated answers
- No source attribution
- Static responses

### After ✅
- Chat shows **LLM-generated answers**
- Grounded in retrieved documents
- Shows sources with similarity scores
- Dynamic real-time responses
- Query latency metrics
- System status monitoring

---

## ✨ Features Now Enabled

✅ **LLM-Generated Answers** - Smart, contextual responses  
✅ **Source Attribution** - See where answers came from  
✅ **Similarity Scores** - Know how relevant each source is  
✅ **Query Latency** - Monitor performance  
✅ **Real-time Updates** - Live metrics  
✅ **Error Handling** - Graceful fallbacks  
✅ **CORS Support** - Frontend-backend communication  

---

## 🎓 Next Steps

1. ✅ Start Python backend: `python -m backend.app.main`
2. ✅ Start Next.js frontend: `npm run dev`
3. ✅ Add your documents to `data/documents/`
4. ✅ Open `http://localhost:3000/chat`
5. ✅ Ask questions and get AI-generated answers!

---

**Happy RAGging!** 🚀

For more details, see [backend/README.md](backend/README.md)
