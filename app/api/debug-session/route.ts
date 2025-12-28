// app/api/debug-session/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  return NextResponse.json({
    session,
    hasUser: !!session?.user,
    hasUserId: !!session?.user?.id,
    userId: session?.user?.id,
  })
}