'use client'

import { Database, Cpu, Layers, FileCode, Network, Sparkles } from 'lucide-react'

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-neuro-dark to-neuro-dark pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            System Architecture
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A deep dive into the neural retrieval stack, vector orchestration, and synthesis protocols powering the NeuroCore RAG model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Technology Stack */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Technology Stack</h2>
            </div>

            {/* Inference Engine */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Inference Engine</h3>
                </div>
                <span className="text-xs text-white/50 bg-purple-600/20 px-3 py-1 rounded-full">
                  MODEL LAYERS
                </span>
              </div>
              <div className="space-y-3 pl-9">
                <div>
                  <p className="text-sm text-white/50 mb-1">CORE MODEL</p>
                  <p className="text-white font-medium">Llama-3 70B Quantized</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">CONTEXT WINDOW</p>
                  <p className="text-white font-medium">128k Tokens (Extended)</p>
                </div>
              </div>
            </div>

            {/* Vector Infrastructure */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Vector Infrastructure</h3>
                </div>
                <span className="text-xs text-white/50 bg-blue-600/20 px-3 py-1 rounded-full">
                  STORAGE LAYERS
                </span>
              </div>
              <div className="space-y-3 pl-9">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                    <span className="text-xs">🌲</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Pinecone Distributed Cluster (p2)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                    <span className="text-xs">⚡</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">OpenAI text-embedding-3-large</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">HNSW Indexing Algorithm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orchestration Logic */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Network className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Orchestration Logic</h3>
                </div>
                <span className="text-xs text-white/50 bg-green-600/20 px-3 py-1 rounded-full">
                  CONTROL LAYERS
                </span>
              </div>
              <div className="pl-9">
                <p className="text-white/50 text-sm">Advanced routing and load balancing</p>
              </div>
            </div>
          </div>

          {/* Right Column - Processing Protocol */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Processing Protocol</h2>
            </div>

            {/* A1 */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">A1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ingestion & Sanitization
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Automated crawling of unstructured data sources. The pipeline executes PII redaction, normalization, and metadata tagging to ensure compliance before entering the neural stream.
                  </p>
                </div>
              </div>
            </div>

            {/* A2 */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">A2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Semantic Chunking
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Documents are split using recursive character strategies with 15% overlap. This preserves semantic boundaries across splits, maintaining context integrity for the embedding model.
                  </p>
                </div>
              </div>
            </div>

            {/* A3 */}
            <div className="glass-effect rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">A3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    High-Dim Vectorization
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Chunks are transformed into 3072-dimensional vectors. These embeddings are upserted into partitioned namespaces within the vector store, optimizing for tenant isolation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
