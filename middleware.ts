import { NextRequest, NextResponse } from 'next/server'

const roleAccess: Record<string, string[]> = {
  '/admin': ['SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'NATIONAL_ADMIN', 'SUPER_ADMIN'],
  '/school': ['SCHOOL_ADMIN'],
  '/student': ['STUDENT'],
  '/organization': ['DISTRICT_ADMIN', 'NATIONAL_ADMIN', 'SUPER_ADMIN'],
}

function allowedForPath(pathname: string, role: string | undefined) {
  for (const base in roleAccess) {
    if (pathname.startsWith(base)) {
      const allowed = roleAccess[base]
      return role ? allowed.includes(role) : false
    }
  }
  return true
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Read role from cookie (set by your auth flow). If using NextAuth, switch to reading session instead.
  const role = req.cookies.get('role')?.value

  if (!allowedForPath(pathname, role)) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/school/:path*',
    '/student/:path*',
    '/organization/:path*',
  ],
}
