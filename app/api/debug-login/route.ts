// app/api/debug-login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    if (!user) {
      return NextResponse.json({ step: 'user lookup', error: 'User not found' })
    }
    
    if (!user.password) {
      return NextResponse.json({ step: 'password check', error: 'No password stored' })
    }
    
    const isValid = await compare(password, user.password)
    
    return NextResponse.json({ 
      step: 'complete',
      userFound: true,
      hasPassword: true,
      passwordValid: isValid,
      passwordHash: user.password.substring(0, 10) + '...' // Just first 10 chars to verify it's bcrypt
    })
  } catch (error) {
    return NextResponse.json({ 
      step: 'error',
      error: String(error) 
    }, { status: 500 })
  }
}