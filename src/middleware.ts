import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('session')?.value
    const { pathname } = request.nextUrl

    // Allow access to login, public assets, and webhooks
    if (
        pathname === '/login' ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/webhooks') ||
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
        // Se for rota de API, retorne 401 Unauthorized JSON em vez de tentar redirecionar (o que quebra PWA/Fetch)
        if (pathname.startsWith('/api')) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized access' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify token validity usando "jose", que funciona na Edge Runtime (Next.js Middleware)
        const secret = new TextEncoder().encode(JWT_SECRET)
        await jwtVerify(token, secret)

        // Se a validação não jogar exceção, o token é criptograficamente válido
        return NextResponse.next()
    } catch (err) {
        console.error('[Middleware] JWT Verification Failed:', err)

        const response = NextResponse.redirect(new URL('/login', request.url))
        // Limpar o cookie inválido para não causar loop
        response.cookies.delete('session')

        if (pathname.startsWith('/api')) {
            return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return response
    }
}

export const config = {
    // Aplica o middleware em TODAS as rotas, exceto arquivos assincronos
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
