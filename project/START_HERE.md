# ⚡ 5-Minute Quick Setup (Copy & Paste)

## Windows Users

### 1. Open PowerShell and paste:
```powershell
# Download Python (if you don't have it)
# From: https://www.python.org/

# Install dependencies
pip install -r backend/requirements.txt

# Create folders
mkdir data\documents -Force

# Install Node dependencies
npm install

# Build knowledge base
python -m backend.app.services.test_rag
```

### 2. Start Backend (PowerShell Terminal 1)
```powershell
python -m backend.app.main
```

**Wait for:**
```
INFO:     Application startup complete
```

### 3. Start Frontend (PowerShell Terminal 2)
```powershell
npm run dev
```

**Wait for:**
```
✓ Ready
```

### 4. Open Chat
```
Browser: http://localhost:3000/chat
```

### 5. Ask a Question
```
Type: "What is machine learning?"
```

---

## macOS/Linux Users

### 1. Open Terminal and paste:
```bash
# Install Python (if you don't have it)
# brew install python3  (macOS)

# Install dependencies
pip3 install -r backend/requirements.txt

# Create folders
mkdir -p data/documents

# Install Node dependencies
npm install

# Build knowledge base
python3 -m backend.app.services.test_rag
```

### 2. Start Backend (Terminal 1)
```bash
python3 -m backend.app.main
```

**Wait for:**
```
INFO:     Application startup complete
```

### 3. Start Frontend (Terminal 2)
```bash
npm run dev
```

**Wait for:**
```
✓ Ready
```

### 4. Open Chat
```
Browser: http://localhost:3000/chat
```

### 5. Ask a Question
```
Type: "What is machine learning?"
```

---

## 🎯 Verify Everything Works

### Backend Check
```bash
# In new terminal:
curl http://localhost:8000/api/status
```

Should return:
```json
{"status":"ready","documents":1,"embedding_model":"...","llm_model":"..."}
```

### Frontend Check
Open: http://localhost:3000

Should show: Orbiting balls animation on home page

### Chat Check
Open: http://localhost:3000/chat

Ask: "What is machine learning?"

Should get: A detailed explanation

---

## 🆘 Quick Fixes

### "python not found"
```bash
# Install Python:
https://www.python.org/
# Or: brew install python3 (macOS)
```

### "node not found"
```bash
# Install Node.js:
https://nodejs.org/
```

### "Backend connection error"
```bash
# Make sure backend is running:
python -m backend.app.main

# AND keep that terminal open!
```

### "No documents error"
```bash
# 1. Add documents to:
data/documents/

# 2. Rebuild:
python -m backend.app.services.test_rag

# 3. Restart backend:
python -m backend.app.main
```

### "First query is slow"
```
Normal! LLM model loading (~1-2 minutes first time)
Just wait...
Second query will be fast (~5-10 seconds)
```

---

## ✅ Expected Output Timeline

```
T+0s:   Run: python -m backend.app.main
T+3s:   See: "INFO: Uvicorn running on http://0.0.0.0:8000"
T+5s:   Run: npm run dev (in new terminal)
T+8s:   See: "✓ Ready"
T+10s:  Open: http://localhost:3000/chat
T+12s:  Ask question
T+20s:  Get answer with sources ✓
```

---

## 📚 What's Included

✅ **Orbiting Balls Animation** - Home page visual
✅ **Chat Interface** - Ask questions about documents
✅ **RAG System** - Retrieves relevant documents + generates explanations
✅ **Sample Document** - machine_learning_guide.txt (ready to ask about)
✅ **FastAPI Backend** - Python API server
✅ **FAISS Vector Search** - Fast similarity search
✅ **FLAN-T5 LLM** - Generates explanatory answers

---

## 🎓 Once It Works...

### Try These Questions:
```
"What is machine learning?"
"What are the types of machine learning?"
"Why is machine learning important?"
"List real-world applications of ML"
"What is supervised learning?"
```

### Add Your Own Documents:
1. Copy PDF/TXT/MD files to `data/documents/`
2. Run: `python -m backend.app.services.test_rag`
3. Restart backend
4. Ask questions about them!

---

## 🔗 Key URLs (Once Running)

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Home (orbiting balls) |
| http://localhost:3000/chat | Chat interface |
| http://localhost:8000/api/status | Backend health check |
| http://localhost:8000/docs | API documentation |

---

## 📞 Still Stuck?

1. **Read:** SETUP_GUIDE.md (comprehensive troubleshooting)
2. **Check:** Both backend AND frontend running?
3. **Verify:** Documents in data/documents/?
4. **Review:** Browser console (F12) for errors
5. **Check:** Terminal logs for error messages

---

**You got this! 🚀**
