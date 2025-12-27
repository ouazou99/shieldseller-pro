// app/api/debug-auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true, 
        name: true,
        password: true // Just checking if it exists
      }
    })
    
    return NextResponse.json({
      userFound: !!user,
      hasPassword: !!user?.password,
      email: user?.email,
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Database error', 
      details: String(error) 
    }, { status: 500 })
  }
}