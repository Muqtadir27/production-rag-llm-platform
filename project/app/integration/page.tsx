'use client'

import { Copy, Check, AlertTriangle, Book, Terminal, Sparkles, Bug, Cloud } from 'lucide-react'
import { useState } from 'react'

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const codeExample = `// Initialize the NeuroCore RAG client
import os
from neurocore import NeuralClient, VectorConfig

// Configure connection parameters
config = VectorConfig(
    dimension=1536,
    metric='cosine_similarity',
    latency_mode='ultra_low'
)

client = NeuralClient(
    os.getenv('NEURO_KEY'),
    config=config
)`

  const terminalOutput = `> python main.py
[NeuroCore] Initializing NeuroCore...
[NeuroCore] Connection established. Encryption: 873-bit.
SUCCESS: 5 vectors retrieved in 0.01s. Confidence: 98.3%`

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-neuro-dark to-neuro-dark pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="space-y-4 mb-12">
          <p className="text-sm text-purple-400 font-semibold uppercase tracking-wide">
            DEV ENVIRONMENT SETUP
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            VS Code Integration
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            Establish a direct neural link between your local environment and the RAG Core. 
            This extension enables real-time vector embedding visualization and model fine-tuning directly within your IDE.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Setup Steps */}
          <div className="space-y-8">
            {/* Install Extension */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
                <Terminal className="w-6 h-6 text-purple-400" />
                <span>INSTALL EXTENSION</span>
              </h2>
              <p className="text-white/70">
                Install the NeuroCore VS Code extension via the marketplace or command line interface.
              </p>
              <div className="relative">
                <div className="glass-effect rounded-lg p-4 font-mono text-sm text-white/90">
                  ext install neurocore.neuralink
                </div>
                <button
                  onClick={() => copyToClipboard('ext install neurocore.neuralink')}
                  className="absolute top-2 right-2 p-2 text-white/50 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">AUTHENTICATION</h2>
              <p className="text-white/70">
                Generate a neural signature (API Key) from your dashboard and configure via the environment.
              </p>
              <div className="glass-effect rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-yellow-400">SENSITIVE DATA</p>
                    <p className="text-sm text-white/70">
                      Never commit API keys. NEURO_KEY=sk_live_808...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Initialize Link */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">INITIALIZE LINK</h2>
              <p className="text-white/70">
                Import the library and verify connection latency.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                  SDK
                </button>
                <button className="px-6 py-3 glass-effect border border-white/20 text-white rounded-lg hover:border-white/40 transition-colors font-semibold flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span>VIEW DOCS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div className="space-y-6">
            <div className="glass-effect rounded-lg overflow-hidden">
              {/* Editor Header */}
              <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-xs text-white/50 ml-4">NeuroCore Workspace</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded border border-purple-500/50">
                    LIVE PREVIEW
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <div className="px-4 py-2 bg-white/10 border-b-2 border-purple-400 text-white text-sm">
                  rag_implementation.py
                </div>
                <div className="px-4 py-2 text-white/50 text-sm">config.json</div>
                <div className="px-4 py-2 text-white/50 text-sm">vectors.csv</div>
              </div>

              {/* Code */}
              <div className="p-4 font-mono text-sm text-white/90">
                <pre className="whitespace-pre-wrap">{codeExample}</pre>
              </div>
            </div>

            {/* Terminal */}
            <div className="glass-effect rounded-lg overflow-hidden">
              <div className="flex border-b border-white/10">
                <div className="px-4 py-2 bg-white/10 text-white text-sm">TERMINAL</div>
                <div className="px-4 py-2 text-white/50 text-sm">OUTPUT</div>
                <div className="px-4 py-2 text-white/50 text-sm">DEBUG CONSOLE</div>
              </div>
              <div className="p-4 font-mono text-sm text-green-400 bg-black/20">
                <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                <div className="mt-4 flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">CONNECTED, 13MS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Auto-Completion</h3>
            <p className="text-white/70">
              Intelligent suggestion for vector parameters and model configurations based on your dataset.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Bug className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Neural Debugger</h3>
            <p className="text-white/70">
              Visualize vector space collisions and anomalies directly within the VS Code sidebar.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
              <Cloud className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Remote Sync</h3>
            <p className="text-white/70">
              Push local model fine-tuning to production clusters with a single command.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
