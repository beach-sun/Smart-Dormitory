import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get('smart_dorm_login')?.value === 'ok'
  if (!loggedIn) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/smart-dorm/:path*']
}
