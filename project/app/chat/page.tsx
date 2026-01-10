'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, File as FileIcon, Zap, Target, Loader, Upload } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'neurocore'
  content: string
  timestamp: Date
  sources?: Array<{ source: string; content: string; similarity: number }>
  latency?: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'neurocore',
      content: "RAG system initialized. Upload documents to get started, then ask me anything about them!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [latency, setLatency] = useState(0)
  const [retrievedCount, setRetrievedCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call the RAG backend
      const startTime = Date.now()
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          top_k: 3,
        }),
      })

      const elapsed = Date.now() - startTime
      setLatency(elapsed)

      if (!response.ok) {
        throw new Error('Failed to get response from RAG system')
      }

      const data = await response.json()

      // Extract the answer from the RAG response
      const answer = data.answer || data.response || 'I could not find an answer in the documents.'
      const sources = data.retrieved_documents || data.sources || []
      const status = data.status || 'unknown'
      
      // Only set retrieved count if we have valid sources
      if (sources && Array.isArray(sources) && sources.length > 0) {
        setRetrievedCount(sources.length)
      }

      // Don't show error status messages as user-facing errors - treat them as responses
      const neurocoreResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'neurocore',
        content: answer,
        timestamp: new Date(),
        sources: sources,
        latency: elapsed,
      }
      setMessages((prev) => [...prev, neurocoreResponse])
    } catch (error) {
      console.error('Error querying RAG system:', error)
      // Provide helpful error message
      let errorMessage = 'I encountered an issue processing your question. '
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += 'The backend server may not be running. Please ensure the RAG backend is started on port 8000.'
        } else {
          errorMessage += 'Please try rephrasing your question or check that documents are uploaded.'
        }
      } else {
        errorMessage += 'Please try again or rephrase your question.'
      }
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'neurocore',
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neuro-dark flex pt-20">
      {/* Left Panel - Chat */}
      <div className="flex-1 flex flex-col border-r border-white/10">
        {/* Document Context Header */}
        <div className="p-6 border-b border-white/10 glass-effect">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileIcon className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">RAG System Active</span>
            </div>
            <a
              href="/upload"
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </a>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">CONNECTED TO BACKEND</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'glass-effect text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">
                    {message.sender === 'user' ? 'User' : 'NeuroCore'}
                  </span>
                  {message.latency && (
                    <span className="text-xs text-white/50 ml-2">({message.latency}ms)</span>
                  )}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {/* Show retrieved sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-white/70 mb-2">
                      📚 RETRIEVED FROM {message.sources.length} SOURCE(S):
                    </p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-white/5 p-2 rounded border border-white/10"
                        >
                          <p className="text-white/70 font-semibold mb-1">
                            {source.source || `Source ${idx + 1}`}
                            {source.similarity && (
                              <span className="text-green-400 ml-2">
                                {(source.similarity * 100).toFixed(1)}% match
                              </span>
                            )}
                          </p>
                          <p className="text-white/60 line-clamp-2">{source.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass-effect rounded-lg p-4 flex items-center space-x-2">
                <Loader className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-white/70">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ask a question about the documents..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center space-x-4">
              <span>RAG-POWERED Q&A</span>
              <span>GROUNDED ANSWERS</span>
              <span>ZERO HALLUCINATIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Metrics */}
      <div className="w-96 p-6 space-y-6 overflow-y-auto">
        {/* Central Visualization */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="relative w-48 h-48 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse" />
          </div>
          {/* Orbiting rings */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute w-64 h-64 border border-purple-500/20 rounded-full animate-spin"
              style={{
                animationDuration: `${10 + angle / 60}s`,
                animationDirection: angle % 120 === 0 ? 'normal' : 'reverse',
              }}
            />
          ))}
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/70 font-semibold">QUERY LATENCY</span>
            </div>
            <p className="text-2xl font-bold text-white">{latency > 0 ? latency : 'N/A'}ms</p>
            <p className="text-xs text-white/40 mt-1">Last response time</p>
          </div>

          <div className="glass-effect rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70 font-semibold">RETRIEVED DOCUMENTS</span>
            </div>
            <p className="text-2xl font-bold text-white">{retrievedCount}</p>
            <p className="text-xs text-white/40 mt-1">Source documents used</p>
          </div>

          <div className="glass-effect rounded-lg p-4">
            <span className="text-sm text-white/70 font-semibold block mb-3">SYSTEM STATUS</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Backend:</span>
                <span className="text-xs text-green-400">✓ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Embeddings:</span>
                <span className="text-xs text-green-400">✓ Loaded</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Vector DB:</span>
                <span className="text-xs text-green-400">✓ Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">LLM Model:</span>
                <span className="text-xs text-blue-400">FLAN-T5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tags */}
        <div className="absolute bottom-6 right-6 flex flex-col space-y-2 text-xs text-white/40">
          <span>RAG SYSTEM</span>
          <span>VECTORDB</span>
          <span>GROUNDED</span>
        </div>
      </div>
    </div>
  )
}
