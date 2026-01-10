'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Upload, File, X } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown']
    const fileName = selectedFile.name.toLowerCase()
    const isAllowed = allowedTypes.includes(selectedFile.type) ||
                     fileName.endsWith('.pdf') ||
                     fileName.endsWith('.txt') ||
                     fileName.endsWith('.md')
    
    if (isAllowed) {
      setFile(selectedFile)
    } else {
      alert('Please upload a PDF, TXT, or MD file')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok && response.status !== 207) {
        throw new Error(data.error || 'Upload failed')
      }

      // Show success message
      alert(`Document "${file.name}" has been uploaded and indexed successfully!`)
      
      // Navigate to chat page after successful upload
      router.push('/chat')
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-neuro-dark to-neuro-dark relative overflow-hidden pt-20">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Initialize Sequence
          </h1>
          <p className="text-xl text-white/70">
            Upload your document to begin the vectorization process
          </p>
        </div>

        <div
          className={`glass-effect rounded-2xl p-12 border-2 border-dashed transition-all ${
            isDragging ? 'border-purple-400 bg-purple-900/20' : 'border-white/20'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!file ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                  <p className="text-xl text-white font-semibold">
                  Drag and drop your document here
                  </p>
                <p className="text-white/50">or</p>
                <label className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0]
                      if (selectedFile) handleFileSelect(selectedFile)
                    }}
                  />
                </label>
              </div>
              <p className="text-sm text-white/40">Supported formats: PDF, TXT, MD</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <File className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-sm text-white/50">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full px-8 py-4 bg-white text-neuro-dark font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : 'Upload & Initialize'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
