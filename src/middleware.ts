import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('session')?.value
    const { pathname } = request.nextUrl

    // Allow access to login and public assets
    if (
        pathname === '/login' ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.includes('logo.png') ||
        pathname === '/favicon.ico'
    ) {
        // If already logged in and trying to access login page, redirect to dashboard
        if (token && pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // Protect all other routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify token validity
        // Note: We use a simple check here, full verification happens in Server Components/Actions
        if (token) {
            return NextResponse.next()
        }
    } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/dashboard/:path*', '/services/:path*', '/clients/:path*', '/settings/:path*'],
}
