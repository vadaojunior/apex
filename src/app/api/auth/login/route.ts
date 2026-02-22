import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json(
                { message: 'Usuário e senha são obrigatórios' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            return NextResponse.json(
                { message: 'Credenciais inválidas' },
                { status: 401 }
            )
        }

        const isPasswordValid = await verifyPassword(password, user.password)

        if (!isPasswordValid) {
            // Ideally implement rate limit / lockout here
            return NextResponse.json(
                { message: 'Credenciais inválidas' },
                { status: 401 }
            )
        }

        await createSession({
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        })

        // Log the access in audit_logs
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                resource: 'AUTH',
                details: `Usuário ${username} logado com sucesso.`
            }
        })

        return NextResponse.json({ message: 'Login realizado com sucesso' })
    } catch (error) {
        console.error('Erro no login:', error)
        return NextResponse.json(
            { message: 'Erro interno no servidor' },
            { status: 500 }
        )
    }
}
