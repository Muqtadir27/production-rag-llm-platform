'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Mail, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [showUseCases, setShowUseCases] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-white font-semibold text-xl">NeuroCore</span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link 
            href="/technology" 
            className={`text-sm ${pathname === '/technology' ? 'text-purple-400' : 'text-white/70 hover:text-white'} transition-colors`}
          >
            Technology
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowUseCases(true)}
            onMouseLeave={() => setShowUseCases(false)}
          >
            <Link 
              href="/use-cases" 
              className={`text-sm flex items-center space-x-1 ${pathname === '/use-cases' ? 'text-purple-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              <span>Use Cases</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
          </div>
          
          <Link 
            href="/integration" 
            className={`text-sm ${pathname === '/integration' ? 'text-purple-400' : 'text-white/70 hover:text-white'} transition-colors`}
          >
            Integration
          </Link>
          
          <Link 
            href="/docs" 
            className={`text-sm ${pathname === '/docs' ? 'text-purple-400' : 'text-white/70 hover:text-white'} transition-colors`}
          >
            Docs
          </Link>
          
          <div className="flex items-center space-x-2 text-white/70">
            <span className="text-sm">ENG</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <Link href="/lets-connect" className="text-white/70 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
