import { NextRequest, NextResponse } from 'next/server'

// Helper: Query RAG backend via HTTP with fallback to subprocess
async function executeRAGQuery(question: string, top_k: number): Promise<any> {
  const BACKEND_URL = process.env.RAG_BACKEND_URL || 'http://localhost:8000'
  
  try {
    // First, try HTTP request to FastAPI server
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, top_k }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        const errorText = await response.text()
        throw new Error(`Backend returned ${response.status}: ${errorText}`)
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // If fetch fails (backend not running), fallback to subprocess
      if (fetchError.name === 'AbortError' || fetchError.message.includes('fetch')) {
        console.warn('FastAPI backend not available, falling back to subprocess...')
        return await executeRAGQuerySubprocess(question, top_k)
      }
      throw fetchError
    }
  } catch (error: any) {
    // Final fallback to subprocess
    console.warn('HTTP query failed, trying subprocess fallback...', error.message)
    return await executeRAGQuerySubprocess(question, top_k)
  }
}

// Fallback: Execute RAG query via subprocess
async function executeRAGQuerySubprocess(question: string, top_k: number): Promise<any> {
  const { spawn } = await import('child_process')
  
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['-m', 'backend.app.services.rag_server'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timeout = setTimeout(() => {
      timedOut = true
      python.kill('SIGTERM')
      setTimeout(() => python.kill('SIGKILL'), 1000)
      reject(new Error('RAG query timed out after 60 seconds'))
    }, 60000)

    python.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    python.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    python.on('error', (err) => {
      clearTimeout(timeout)
      reject(new Error(`Failed to start RAG process: ${err.message}`))
    })

    python.on('close', (code) => {
      clearTimeout(timeout)
      
      if (timedOut) {
        reject(new Error('RAG query timed out'))
        return
      }

      if (!stdout.trim()) {
        reject(new Error(`RAG process failed (code ${code}): ${stderr || 'No output'}`))
        return
      }

      try {
        // Try to parse JSON from stdout
        const lines = stdout.split('\n').filter(line => line.trim())
        for (const line of lines) {
          if (line.includes('{')) {
            try {
              const result = JSON.parse(line)
              if (result.question || result.answer) {
                resolve(result)
                return
              }
            } catch (e) {
              // Try next line
              continue
            }
          }
        }
        // If no valid JSON found, try parsing entire stdout
        const result = JSON.parse(stdout)
        resolve(result)
      } catch (parseError: any) {
        reject(new Error(`Failed to parse RAG response: ${parseError.message}. Output: ${stdout.substring(0, 200)}`))
      }
    })

    // Send request
    try {
      const requestData = JSON.stringify({ question, top_k })
      python.stdin.write(requestData)
      python.stdin.end()
    } catch (writeError: any) {
      clearTimeout(timeout)
      reject(new Error(`Failed to write to RAG process: ${writeError.message}`))
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { question, top_k = 3 } = await request.json()

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    try {
      const result = await executeRAGQuery(question.trim(), Math.min(top_k, 5))
      
      // Ensure we have a valid response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from RAG backend')
      }
      
      // Validate and format response
      const response = {
        question: result.question || question,
        answer: result.answer || 'I could not generate an answer. Please try rephrasing your question.',
        status: result.status || 'success',
        retrieved_documents: result.retrieved_documents || []
      }
      
      return NextResponse.json(response)
    } catch (error: any) {
      console.error('RAG query failed:', error)
      
      // Provide helpful error message to user
      const errorMsg = error.message || 'Failed to process your question'
      
      // Check if it's a connection error (backend not running)
      let userMessage = 'I encountered an issue processing your question. '
      if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('fetch') || errorMsg.includes('Failed to start')) {
        userMessage += 'The RAG backend may not be running. Please ensure the backend server is started.'
      } else {
        userMessage += 'Please try rephrasing your question or check that documents are uploaded.'
      }
      
      return NextResponse.json(
        {
          question,
          answer: userMessage,
          retrieved_documents: [],
          status: 'error',
          error: errorMsg
        },
        { status: 200 } // Return 200 so frontend can display the message
      )
    }
  } catch (error) {
    console.error('Error in /api/query:', error)

    return NextResponse.json(
      {
        answer: `Server error: ${error instanceof Error ? error.message : 'Failed to process query'}`,
        retrieved_documents: [],
        status: 'error',
      },
      { status: 500 }
    )
  }
}
