import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create unique filename
    const filename = `${Date.now()}-${file.name}`
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    const publicPath = path.join(uploadsDir, filename)
    
    // Save file to public/uploads
    await writeFile(publicPath, buffer)
    
    // Return the public URL
    return NextResponse.json({ 
      url: `/uploads/${filename}`
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Configure body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
} 