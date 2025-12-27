// app/api/debug-auth-config/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length,
    NEXTAUTH_SECRET_FIRST_CHAR: process.env.NEXTAUTH_SECRET?.charAt(0),
    NEXTAUTH_SECRET_LAST_CHAR: process.env.NEXTAUTH_SECRET?.charAt((process.env.NEXTAUTH_SECRET?.length || 1) - 1),
  })
}