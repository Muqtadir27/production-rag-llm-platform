# 🚀 Complete RAG Q&A Setup - Step by Step

## Issue You're Seeing
The chat shows "Error: Failed to get response from RAG system" - this means the **backend is not running**.

---

## ✅ Complete Setup (Do This First!)

### Step 1: Install All Dependencies

Open PowerShell in your project folder and run:

```bash
pip install -r backend/requirements.txt
```

**Expected output:**
```
Successfully installed transformers torch sentence-transformers faiss-cpu PyPDF2 ... etc
```

> ⚠️ **This takes 5-10 minutes on first install** (downloading LLM models)

---

### Step 2: Create and Populate Documents Folder

```bash
mkdir -p data/documents
```

**Add your documents:** Place PDFs, TXTs, or MDs in `data/documents/`

Example:
```
data/documents/
├── myfile.pdf
├── documentation.txt
└── guide.md
```

---

### Step 3: Build the Vector Index

In PowerShell, run:

```bash
python -m backend.app.services.test_rag
```

**This will:**
1. Load all documents from `data/documents/`
2. Split them into chunks
3. Generate embeddings
4. Create vector index
5. Show example queries

**Expected output:**
```
INFO:     Loaded document: myfile.pdf
INFO:     Split into 45 chunks
INFO:     Generated embeddings for 45 chunks
INFO:     Vector store built and saved
```

---

### Step 4: Start Python Backend (Terminal 1)

```bash
python -m backend.app.main
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

> ⚠️ **Leave this running in the background!**

---

### Step 5: Start Next.js Frontend (Terminal 2)

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
Local:  http://localhost:3000
```

---

### Step 6: Open Chat

Visit: **http://localhost:3000/chat**

Now ask questions! 🎉

---

## 💬 Example Interaction

### You Ask:
```
"What is machine learning?"
```

### RAG Responds:
```
Machine learning is a subset of artificial intelligence that enables 
systems to learn and improve from experience without being explicitly 
programmed. Based on the document, there are three main types:

1. Supervised Learning - Uses labeled data to train models
2. Unsupervised Learning - Finds patterns in unlabeled data
3. Reinforcement Learning - Learns through trial and error

According to Section 2.1, these techniques are fundamental to modern AI systems.

📚 SOURCES:
• Document.pdf (94% match) - "Machine learning is..."
• Document.pdf (89% match) - "There are three types..."
• Document.pdf (82% match) - "Supervised learning uses..."

⚡ Query Latency: 245ms
📄 Retrieved Documents: 3
```

---

## 🔧 How It Works

```
Your Question in Chat
        ↓
Chat Page sends to: /api/query
        ↓
Next.js API proxies to: http://localhost:8000/api/query
        ↓
Python RAG Pipeline:
  1. Convert question to embeddings
  2. Search vector database for similar chunks
  3. Retrieve 3 most relevant chunks
  4. Pass to FLAN-T5 LLM with instructions
  5. LLM generates explanatory answer
        ↓
Response with:
  - Detailed answer with explanations
  - Retrieved source documents
  - Similarity scores
  - Query metrics
```

---

## ❌ Troubleshooting

### Error: "Error: Failed to get response from RAG system"

**Cause:** Backend not running

**Solution:**
```bash
# Terminal 1: Start the backend
python -m backend.app.main

# Should show: INFO: Uvicorn running on http://0.0.0.0:8000
```

---

### Error: "ModuleNotFoundError: No module named 'torch'"

**Cause:** Dependencies not installed

**Solution:**
```bash
pip install -r backend/requirements.txt
```

---

### Error: "No documents found" in backend

**Cause:** No documents in data/documents/

**Solution:**
```bash
# Create the directory
mkdir -p data/documents

# Copy your PDFs/TXTs/MDs here
# Then run:
python -m backend.app.services.test_rag
```

---

### Chat loads but takes forever to respond

**Cause:** First query loads the LLM model (large file)

**Solution:** Wait 2-3 minutes for first response. Subsequent queries are faster.

---

### "Connection refused" error

**Cause:** Backend not running on http://localhost:8000

**Solution:**
```bash
# Start backend in a separate terminal
python -m backend.app.main
```

---

## ✨ What to Ask the RAG System

The system will answer ANY question based on your documents:

✅ "What is [concept] in this document?"  
✅ "Explain [topic] to me"  
✅ "Summarize the key points"  
✅ "How does [feature] work?"  
✅ "What are the main sections?"  
✅ "Tell me more about [subject]"  

---

## 📊 System Architecture

```
Frontend (Next.js)
    ↓
API Layer (/api/query)
    ↓
Python FastAPI (backend/app/main.py)
    ↓
RAG Pipeline:
    ├─ DocumentLoader (loads your files)
    ├─ TextSplitter (breaks into chunks)
    ├─ EmbeddingService (converts to vectors)
    ├─ VectorStore (FAISS search)
    ├─ LLMService (FLAN-T5 generates answers)
    └─ PromptService (crafts good prompts)
    ↓
Response with Answer + Sources
```

---

## 🎯 Quick Checklist

- [ ] Installed dependencies: `pip install -r backend/requirements.txt`
- [ ] Added documents to: `data/documents/`
- [ ] Built index: `python -m backend.app.services.test_rag`
- [ ] Backend running: `python -m backend.app.main`
- [ ] Frontend running: `npm run dev`
- [ ] Chat accessible at: http://localhost:3000/chat
- [ ] Asking questions and getting answers!

---

## 🚀 Ready to Go!

Once everything is running, you should be able to:

1. ✅ Ask any question about your documents
2. ✅ Get detailed, explanatory answers
3. ✅ See which documents the answer came from
4. ✅ View similarity scores for each source
5. ✅ Monitor query latency

**Happy RAGging!** 🎉

---

## 📞 Quick Commands Reference

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Build vector index
python -m backend.app.services.test_rag

# Start backend (Terminal 1)
python -m backend.app.main

# Start frontend (Terminal 2)
npm run dev

# Test integration
python test_rag_integration.py
```

---

## 📁 File Locations

- **Documents:** `data/documents/`
- **Vector Index:** `data/vector_index/`
- **Backend Code:** `backend/app/services/`
- **Frontend:** `app/chat/page.tsx`
- **API Endpoint:** `app/api/query/route.ts`

---

That's it! You're ready to use the RAG system. 🚀
