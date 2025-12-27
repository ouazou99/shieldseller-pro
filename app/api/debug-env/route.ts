// app/api/debug-env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    hasDb: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  })
}