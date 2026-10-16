import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/auth/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', payload.role as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('accessToken')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/login).*)'],
}