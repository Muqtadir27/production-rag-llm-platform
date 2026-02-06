# RAG (Retrieval Augmented Generation) Project - Technical Summary

## Project Overview
A **local, free, offline Retrieval Augmented Generation (RAG) system** that combines vector search with language models to provide intelligent, context-aware answers without cloud dependencies or API costs.

---

## Architecture

### **Tech Stack**
- **Frontend**: HTML5, CSS3, JavaScript (ES Modules) + Three.js for 3D visualization
- **Backend**: Node.js + Express.js
- **LLM Runtime**: Ollama (local, offline)
- **Vector Embeddings**: NOMIC (nomic-embed-text)
- **Text Generation**: Phi3
- **Vector Database**: In-memory JavaScript arrays
- **PDF Processing**: pdf-parse
- **Server Runtime**: Python HTTP server (frontend) + Node.js (backend)

---

## System Components

### **Backend (Port 3001)**
Located in `/backend` directory

#### Core RAG Pipeline:
1. **Ingest** (`ingest.js`, `ingestPdf.js`)
   - Reads base documents from `data/docs.json`
   - Processes uploaded PDF files
   - Chunks text with configurable overlap (default: 400 words, 50 word overlap)
   - Generates embeddings for each chunk

2. **Embed** (`embed.js`)
   - Uses Ollama's nomic-embed-text model
   - Converts text chunks to 768-dimensional vectors
   - Calls: `http://localhost:11434/api/embeddings`

3. **Retrieve** (`retrieve.js`)
   - Takes user query and converts to embedding
   - Performs cosine similarity search
   - Returns top-K most relevant documents (default: 3)

4. **Generate** (`generate.js`)
   - Takes retrieved context + user question
   - Creates grounded prompt (uses ONLY context provided)
   - Calls Ollama Phi3 model for generation
   - Calls: `http://localhost:11434/api/generate`
   - Temperature: 0 (deterministic)

5. **Similarity** (`similarity.js`)
   - Cosine similarity calculation for vector matching

6. **Index** (`index.js`)
   - In-memory storage for documents and vectors
   - Shared across all RAG operations

#### API Endpoints:
- `POST /query` - Submit question, get grounded answer + sources
- `POST /upload` - Upload PDF file for ingestion
- `GET /documents` - List last 100 ingested documents
- `GET /health` - Health check

### **Frontend (Port 8080)**
Located in `/frontend` directory

#### Pages:
1. **index.html** - Main interface
   - Three.js 3D visualization canvas
   - Query input field with placeholder "Ask the knowledge base…"
   - Navigation system

2. **explore.html** - Document explorer
   - Browse ingested documents
   - View sources and chunks

3. **upload.html** - PDF upload interface
   - Drag-and-drop or file selection
   - Upload functionality

4. **how.html** - How it works guide
   - Project documentation
   - Usage instructions

#### JavaScript Modules:
- `api.js` - Backend API communication
- `main.js` - Main page logic
- `nav.js` - Navigation system
- `explore.js` - Document explorer logic
- `upload.js` - PDF upload handler
- `how.js` - How page logic
- `style.css` - Styling

---

## Current Data

### Base Documents (4 documents ingested):
1. "RAG stands for Retrieval Augmented Generation."
2. "RAG combines vector search with language models to improve answers."
3. "Three.js is a JavaScript library for rendering 3D graphics in the browser."
4. "Local language models can be run using Ollama without any API cost."

---

## Data Flow

```
User Query
    ↓
[Frontend Query Input]
    ↓
[Backend /query endpoint]
    ↓
[Embed Query] → Ollama NOMIC
    ↓
[Cosine Similarity Search] → Compare with document vectors
    ↓
[Retrieve Top-3 Documents]
    ↓
[Prompt Engineering] → Add context + question
    ↓
[Generate Response] → Ollama Phi3 (temp=0, grounded)
    ↓
[Return Answer + Sources]
    ↓
[Frontend Display] → Show answer & source attribution
```

---

## UI Requirements for Snitch

### **Homepage (index.html)**
- **Hero Section**: "Ask the knowledge base…" input field
- **3D Canvas**: Three.js visualization (background element)
- **Features**:
  - Real-time query processing
  - Answer display with source attribution
  - Loading states during embedding & generation
  - Error handling with user-friendly messages

### **Query Results Display**
- Answer text (grounded, no hallucination)
- Source list with:
  - Document/PDF name
  - Text chunk reference
  - Relevance indication

### **Document Explorer (explore.html)**
- Table/Grid view of all ingested documents
- Sortable columns: Source, Chunk ID, Content preview
- Search/filter capability
- Pagination for 100+ documents

### **PDF Upload (upload.html)**
- Drag-and-drop zone
- File selector button
- Upload progress indicator
- Success/error notifications
- List of recently uploaded files

### **Navigation (nav.js)**
- Home | Explore | Upload | How it Works
- Consistent header across all pages
- Mobile-responsive menu

### **Visual Design Considerations**
- Modern, clean UI matching the tech stack
- Dark/light theme toggle (optional)
- Responsive design (mobile, tablet, desktop)
- Accessible fonts and contrast ratios
- Loading animations during LLM processing
- Toast notifications for user feedback

---

## Dependencies

### **Backend (package.json)**
```json
{
  "cors": "^2.8.5",
  "express": "^5.2.1",
  "fs-extra": "^11.3.3",
  "multer": "^2.0.2",
  "node-fetch": "^3.3.2",
  "pdf-parse": "^2.4.5"
}
```

### **Frontend**
- Three.js (via CDN)
- No build process required (vanilla JS)

### **Runtime Requirements**
- Node.js (backend)
- Python 3 (frontend server)
- Ollama with nomic-embed-text & phi3 models

---

## Deployment Notes

- **Currently**: Local development setup
- **Backend**: `npm start` from `/backend`
- **Frontend**: Python HTTP server from `/frontend`
- **CORS**: Enabled for frontend-backend communication
- **Port Binding**: Backend on 3001, Frontend on 8080

---

## Performance Characteristics

- **Query Time**: ~2-5 seconds (depends on model speed)
  - Embedding: ~1s
  - Similarity search: <100ms
  - Generation: ~1-4s
- **Memory**: Models loaded in Ollama process (separate from app)
- **Scalability**: Limited by in-memory storage; no database persistence
- **Accuracy**: High (grounded in provided context only)

---

## Future Enhancements (Optional)

1. Persistent vector database (FAISS, Pinecone, etc.)
2. Advanced chunking strategies (semantic, hierarchical)
3. Multi-model support (switching between LLMs)
4. Chat history/conversation tracking
5. Document analytics dashboard
6. Export/import knowledge base
7. Advanced RAG techniques (re-ranking, fusion retrieval)

---

## Security Considerations

- All processing local (no data sent to external APIs)
- File upload validation (PDFs only, size limits)
- CORS headers properly configured
- No authentication (local use only)

---

## Contact & Questions

For UI implementation details or clarifications, refer to:
- Backend routes: `/backend/server.js`
- Frontend structure: `/frontend/` directory
- RAG pipeline logic: `/backend/rag/` directory
