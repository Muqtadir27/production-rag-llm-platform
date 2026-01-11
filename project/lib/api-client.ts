/**
 * API Client for NeuroCore RAG Backend
 * 
 * This client communicates directly with the FastAPI backend.
 * For static export (GitHub Pages), the backend URL must be set via environment variable.
 * 
 * In local development: NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
 * In production: NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface QueryRequest {
  question: string
  top_k?: number
}

export interface QueryResponse {
  question: string
  answer: string
  status: string
  retrieved_documents: Array<{
    content: string
    metadata: Record<string, any>
    similarity?: number
  }>
  error?: string
}

export interface UploadResponse {
  success: boolean
  message: string
  file?: string
  warning?: string
  error?: string
}

/**
 * Query the RAG backend with a question
 */
export async function queryRAG(request: QueryRequest): Promise<QueryResponse> {
  const response = await fetch(`${BACKEND_URL}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: request.question.trim(),
      top_k: request.top_k || 3,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Backend returned ${response.status}: ${errorText}`)
  }

  return await response.json()
}

/**
 * Upload a document to the backend
 * 
 * The backend will save the file and rebuild the vector index automatically.
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BACKEND_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(errorData.detail || errorData.error || 'Upload failed')
  }

  return await response.json()
}
