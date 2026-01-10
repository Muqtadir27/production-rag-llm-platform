import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/pdf']
    const fileName = file.name.toLowerCase()
    const isAllowed = allowedTypes.some(type => file.type === type) ||
                     fileName.endsWith('.txt') ||
                     fileName.endsWith('.md') ||
                     fileName.endsWith('.pdf')

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Only TXT, MD, and PDF files are allowed' },
        { status: 400 }
      )
    }

    // Create documents directory if it doesn't exist
    const documentsDir = join(process.cwd(), 'data', 'documents')
    if (!existsSync(documentsDir)) {
      await mkdir(documentsDir, { recursive: true })
    }

    // Save the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(documentsDir, file.name)

    await writeFile(filePath, buffer)

    // Rebuild the vector index
    try {
      await execAsync(
        'python -m backend.app.services.build_index_runner',
        {
          cwd: process.cwd(),
          timeout: 120000, // 2 minutes
        }
      )
      
      return NextResponse.json({
        success: true,
        message: `Document '${file.name}' uploaded and index rebuilt successfully`,
        file: file.name,
      })
    } catch (error: any) {
      console.error('Index rebuild error:', error)
      return NextResponse.json({
        success: true,
        message: `Document '${file.name}' uploaded but index rebuild failed. Try reloading.`,
        file: file.name,
        warning: 'Index rebuild failed',
      }, { status: 207 }) // Partial success
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    )
  }
}
