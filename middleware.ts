import { NextResponse, type NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const loggedIn = request.cookies.get('smart_dorm_login')?.value === 'ok'
//   if (loggedIn) return NextResponse.next()
//   const loginUrl = new URL('/login', request.url)
//   loginUrl.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
//   return NextResponse.redirect(loginUrl)
// }
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/smart-dorm/:path*']
}
