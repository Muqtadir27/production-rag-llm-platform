'use client'

import { Scale, Heart, TrendingUp, Code, Shield, Bot, ExternalLink } from 'lucide-react'

const useCases = [
  {
    icon: Scale,
    title: 'Legal Analysis',
    description: 'Instantly retrieve case precedents and synthesize legal arguments with citation-backed accuracy, reducing research time by 85%.',
    color: 'purple',
    link: '#',
  },
  {
    icon: Heart,
    title: 'Medical Diagnostics',
    description: 'Cross-reference patient symptoms against global medical journals and clinical trials to assist in complex differential diagnoses.',
    color: 'blue',
    link: '#',
  },
  {
    icon: TrendingUp,
    title: 'Financial Intelligence',
    description: 'Parse quarterly reports and market news in real-time to generate predictive investment models with transparent reasoning.',
    color: 'orange',
    link: '#',
  },
  {
    icon: Code,
    title: 'Code Synthesis',
    description: 'Navigate legacy codebases with semantic understanding to generate refactoring plans and security patches automatically.',
    color: 'green',
  },
  {
    icon: Shield,
    title: 'Threat Detection',
    description: 'Correlate network logs with global threat intelligence feeds to identify zero-day vulnerabilities before exploitation.',
    color: 'red',
  },
  {
    icon: Bot,
    title: 'Autonomous Support',
    description: 'Deploy Tier-3 capable AI agents that resolve complex customer inquiries by instantly retrieving from technical documentation.',
    color: 'yellow',
  },
]

const colorClasses = {
  purple: 'bg-purple-600/20 text-purple-300 border-purple-500/50',
  blue: 'bg-blue-600/20 text-blue-300 border-blue-500/50',
  orange: 'bg-orange-600/20 text-orange-300 border-orange-500/50',
  green: 'bg-green-600/20 text-green-300 border-green-500/50',
  red: 'bg-red-600/20 text-red-300 border-red-500/50',
  yellow: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50',
}

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-neuro-dark to-neuro-dark pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Deployed Neural Applications
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Harness the power of RAG across diverse industries. From legal precision to bio-medical synthesis, 
            see how NeuroCore is reshaping information retrieval with 99.9% accuracy.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            const colorClass = colorClasses[useCase.color as keyof typeof colorClasses]
            
            return (
              <div key={index} className="glass-effect rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-all">
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold text-white">
                  {useCase.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {useCase.description}
                </p>
                
                {useCase.link && (
                  <a
                    href={useCase.link}
                    className={`inline-flex items-center space-x-2 text-sm font-medium ${colorClass} px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity`}
                  >
                    <span>VIEW PROTOCOL</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
