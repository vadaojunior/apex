import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(clients)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar clientes' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { name, cpf, phone, email } = await request.json()

        const client = await prisma.client.create({
            data: { name, cpf, phone, email }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.userId,
                action: 'CREATE',
                resource: 'CLIENT',
                details: `Cliente criado: ${name}`
            }
        })

        return NextResponse.json(client)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao criar cliente' }, { status: 500 })
    }
}
