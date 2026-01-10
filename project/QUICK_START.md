# Quick Start Guide - NeuroCore RAG System

## What is This?

NeuroCore RAG is a smart document Q&A system that:
- Reads documents you upload (PDF, TXT, Markdown)
- Answers your questions using information from those documents  
- Shows you which parts of the documents it used
- Provides relevance scores (0-100%) for transparency

## Starting the System (1 minute)

### Start the Server

Open PowerShell in the project folder and run:
```powershell
npm run dev -- -p 3001
```

### Open the Chat Interface

Go to your browser and visit:
```
http://localhost:3001/chat
```

## How to Use It

### Step 1: Upload a Document
- Click the **"Add Document"** button
- Select a PDF, TXT, or Markdown file
- Wait for the **[OK]** confirmation message

### Step 2: Ask Questions
- Type your question in the chat box
- Press Enter to send
- Wait 3-10 seconds for the answer

### Step 3: Review Sources
Each answer shows:
- **The AI-generated answer** (based on your document)
- **Source documents** (which parts it used)
- **Similarity scores** (how relevant each part is)

## Example Questions

For your resume:
```
"What are your main programming skills?"
"What is your educational background?"
"List your work experience"
"What certifications do you have?"
```

For any document:
```
"What is the main topic?"
"Summarize the key points"
"Who is the author?"
"What are the conclusions?"
```

#### Step 4: Start the Backend (Terminal 1)
```bash
python -m backend.app.main
```

You should see:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Step 5: Start the Frontend (Terminal 2)
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

#### Step 6: Ask Questions!
Go to: **http://localhost:3000/chat**

## 📝 Example Usage

### Sample Question:
```
What is machine learning and why is it important?
```

### Expected Response:
The RAG system will:
1. Search for relevant information in your documents
2. Generate a detailed explanation
3. Show you which documents it used
4. Display the similarity score for each source

Example answer:
```
Machine learning is a subset of artificial intelligence that enables systems 
to learn and improve from experience without being explicitly programmed. 
It uses algorithms and statistical models to analyze patterns in data.

Machine learning is important because it can identify relationships between 
variables that humans might not easily detect, automatically improving performance 
as it's exposed to more data.

[Retrieved from machine_learning_guide.txt - Score: 0.89]
```

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'transformers'"
**Solution:** Run `pip install -r backend/requirements.txt`

### Error: "CORS error" or "Failed to get response from RAG system"
**Solution:** Make sure the backend is running:
```bash
python -m backend.app.main
```

### First query is slow (1-2 minutes)
**Normal!** The system is loading the LLM model (FLAN-T5) into memory. Subsequent queries are much faster (~5-10 seconds).

### Error: "No documents found in data/documents"
**Solution:** Add documents to `data/documents/` folder, then rebuild:
```bash
python -m backend.app.services.test_rag
```

### Port 8000 or 3000 already in use
**Solution:** Close other applications or modify ports:
```bash
# For backend (edit main.py, change port in uvicorn.run)
# For frontend (run: npm run dev -- -p 3001)
```

## 📚 Supported Document Types

- ✅ **PDF** (.pdf)
- ✅ **Text** (.txt)
- ✅ **Markdown** (.md)

Each document is split into chunks and processed to create a searchable knowledge base.

## 🏗️ How It Works

```
You ask a question
        ↓
Frontend sends to Backend API
        ↓
Vector Search finds relevant documents
        ↓
LLM generates detailed explanation
        ↓
Shows answer + sources + confidence scores
```

## ⚙️ Configuration

### Change Number of Retrieved Documents
In `app/chat/page.tsx`, line with fetch to `/api/query`:
```typescript
body: JSON.stringify({ question: userMessage.content, top_k: 5 })  // Default is 3
```

### Change LLM Model
In `backend/app/services/llm.py`:
```python
# Use different models:
# "google/flan-t5-base" (current)
# "google/flan-t5-large" (slower, more powerful)
# "google/flan-t5-xl" (very slow, best quality)
```

### Change Embedding Model
In `backend/app/services/embeddings.py`:
```python
# Use different embeddings:
# "sentence-transformers/all-MiniLM-L6-v2" (current, fast)
# "sentence-transformers/all-mpnet-base-v2" (better quality)
```

## 🚀 Tips for Best Results

1. **Provide Good Documents**: The quality of documents directly affects answer quality
2. **Use Clear Questions**: Ask specific, detailed questions
3. **Chunk Size**: Documents are split into 512-character chunks (default)
4. **Retrieval Count**: More retrieved documents = more context but slower responses

## 📊 System Requirements

- **Python**: 3.10 or higher
- **Node.js**: 16 or higher
- **RAM**: 8GB minimum (for LLM model)
- **Disk**: 2GB (for models and data)
- **GPU** (Optional): Much faster inference, but CPU works too

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/query` | Ask a question |
| GET | `/api/status` | Get system status |
| POST | `/api/build` | Rebuild knowledge base |
| GET | `/docs` | Swagger API documentation |

Example API request:
```bash
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?", "top_k": 3}'
```

## 🎯 Next Steps

1. Run `start_rag.bat` or follow manual setup above
2. Add your own documents to `data/documents/`
3. Ask questions in the chat interface
4. Explore the API with Swagger at `http://localhost:8000/docs`

## 💡 Common Use Cases

- **Research Assistant**: Ask questions about research papers
- **Documentation Help**: Get answers from your codebase documentation
- **Customer Support**: Answer customer questions from knowledge base
- **Learning Assistant**: Learn from educational materials

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Check that both backend and frontend are running
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart both servers

---

**Happy querying!** 🎉
