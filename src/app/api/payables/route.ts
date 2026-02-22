import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const payables = await prisma.payable.findMany({
            orderBy: { dueDate: 'asc' }
        })
        return NextResponse.json(payables)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar contas a pagar' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { description, category, amount, dueDate, status, isRecurring, recurrenceInterval } = await request.json()

        const payable = await prisma.payable.create({
            data: {
                description,
                category,
                amount,
                dueDate: new Date(dueDate),
                status: status || 'OPEN',
                isRecurring: isRecurring || false,
                recurrenceInterval
            }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.userId,
                action: 'CREATE',
                resource: 'PAYABLE',
                details: `Conta a pagar criada: ${description}, Valor: ${amount / 100}`
            }
        })

        return NextResponse.json(payable)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao criar conta a pagar' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { id, status } = await request.json()

        const updated = await prisma.payable.update({
            where: { id },
            data: { status }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.userId,
                action: 'UPDATE',
                resource: 'PAYABLE',
                details: `Conta a pagar ${id} atualizada para status: ${status}`
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar conta a pagar' }, { status: 500 })
    }
}
