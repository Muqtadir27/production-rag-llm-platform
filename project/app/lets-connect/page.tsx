'use client'

import { useRouter } from 'next/navigation'
import { Calendar, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import BookingModal from '@/components/BookingModal'

export default function LetsConnectPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
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
    <>
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute inset-8 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-2xl" />
            <div className="absolute inset-16 bg-white/10 rounded-full" />
            
            {/* Orbiting elements */}
            {[0, 120, 240].map((angle) => (
              <div
                key={angle}
                className="absolute w-4 h-4 bg-purple-400 rounded-full glow-effect animate-orbit"
                style={{
                  transformOrigin: 'center',
                  animationDelay: `${angle / 360}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white">
              Let's Connect: Book a Call
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Ready to deploy your custom RAG architecture? Schedule a strategic consultation with our neural engineers 
              to discuss integration, scaling, and data security.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-8 px-8 py-4 bg-white text-neuro-dark font-semibold rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 glow-effect flex items-center space-x-2 mx-auto"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Free Call</span>
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

      {showModal && <BookingModal onClose={() => setShowModal(false)} />}
    </>
  )
}
