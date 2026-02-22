import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(services)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar serviços' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { name, description, price } = await request.json()

        const service = await prisma.service.create({
            data: {
                name,
                description,
                price // price should be in cents
            }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.userId,
                action: 'CREATE',
                resource: 'SERVICE',
                details: `Serviço criado: ${name}`
            }
        })

        return NextResponse.json(service)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao criar serviço' }, { status: 500 })
    }
}
