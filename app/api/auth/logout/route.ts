import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const url = new URL('/login', request.url)
  const res = NextResponse.redirect(url, { status: 303 })
  res.cookies.set('smart_dorm_login', '', { path: '/', maxAge: 0 })
  return res
}
