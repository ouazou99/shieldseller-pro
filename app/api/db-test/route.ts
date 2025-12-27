// app/api/db-test/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: { email: true, name: true },
      take: 5
    })
    return NextResponse.json({ 
      connected: true, 
      userCount,
      users
    })
  } catch (error) {
    return NextResponse.json({ 
      connected: false, 
      error: String(error) 
    }, { status: 500 })
  }
}