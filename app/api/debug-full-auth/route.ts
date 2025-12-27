// app/api/debug-full-auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { encode } from 'next-auth/jwt'

export async function POST(req: Request) {
  const steps: string[] = []
  
  try {
    const { email, password } = await req.json()
    steps.push('1. Parsed request body')

    const user = await prisma.user.findUnique({
      where: { email },
    })
    steps.push(`2. Database query complete. User found: ${!!user}`)

    if (!user || !user.password) {
      return NextResponse.json({ steps, error: 'User not found or no password' })
    }

    const isValid = await compare(password, user.password)
    steps.push(`3. Password comparison complete. Valid: ${isValid}`)

    if (!isValid) {
      return NextResponse.json({ steps, error: 'Invalid password' })
    }

    const token = await encode({
      token: { 
        id: user.id,
        email: user.email, 
        name: user.name,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    })
    steps.push(`4. JWT encoded. Token length: ${token.length}`)

    return NextResponse.json({ 
      steps, 
      success: true,
      tokenPreview: token.substring(0, 20) + '...'
    })
  } catch (error) {
    return NextResponse.json({ 
      steps,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}