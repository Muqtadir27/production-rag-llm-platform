'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-neuro-dark to-neuro-dark relative overflow-hidden pt-20">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-purple-400/30 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Central glowing orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Main central sphere with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full shadow-2xl relative z-10" style={{
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4)'
              }} />
            </div>
          </div>
          
          {/* Orbiting balls - Three balls revolving around center */}
          {[0, 120, 240].map((startAngle, idx) => (
            <div
              key={startAngle}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="absolute w-6 h-6 rounded-full glow-effect"
                style={{
                  width: '24px',
                  height: '24px',
                  top: '50%',
                  left: '50%',
                  transformOrigin: '50% 50%',
                  animation: `orbit-${idx} 8s linear infinite`,
                  background: idx === 0 
                    ? 'linear-gradient(135deg, rgb(139, 92, 246), rgb(59, 130, 246))'
                    : idx === 1
                    ? 'linear-gradient(135deg, rgb(34, 211, 238), rgb(59, 130, 246))'
                    : 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))',
                  boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)',
                }}
              />
            </div>
          ))}
          
          {/* Inner decorative rings */}
          <div className="absolute inset-8 rounded-full border border-purple-400/20" />
          <div className="absolute inset-16 rounded-full border border-blue-400/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            Elevate Your Retrieval Experience
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Unlock the raw potential of your data in a fully regulated neural environment. 
            Powered by next-gen vector embeddings that connect the unconnected.
          </p>

          <button
            onClick={() => router.push('/upload')}
            className="mt-8 px-8 py-4 bg-white text-neuro-dark font-semibold rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 glow-effect"
          >
            Initialize Sequence
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="mt-32 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white/70">LATENCY</h3>
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-white/50">Unparalleled Query Speed</p>
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
              <p className="text-2xl font-bold text-white">1.3ms</p>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white/70">ACCURACY</h3>
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">98.4%</p>
            <p className="text-sm text-white/50">Context Retention</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">NEURAL LINK ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
