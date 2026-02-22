import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    try {
        const where: any = {}
        if (status) where.status = status

        const receivables = await prisma.receivable.findMany({
            where,
            include: {
                client: true,
                sale: true
            },
            orderBy: { dueDate: 'asc' }
        })
        return NextResponse.json(receivables)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar contas a receber' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { id, receivedAmount, notes, status } = await request.json()

        const receivable = await prisma.receivable.findUnique({
            where: { id }
        })

        if (!receivable) {
            return NextResponse.json({ message: 'Conta não encontrada' }, { status: 404 })
        }

        const newReceivedAmount = receivable.receivedAmount + receivedAmount
        const newStatus = status || (newReceivedAmount >= receivable.amount ? 'PAID' : 'OPEN')

        const updated = await prisma.$transaction(async (tx) => {
            const rec = await tx.receivable.update({
                where: { id },
                data: {
                    receivedAmount: newReceivedAmount,
                    status: newStatus,
                }
            })

            if (receivedAmount > 0) {
                await tx.paymentRecord.create({
                    data: {
                        receivableId: id,
                        amount: receivedAmount,
                        notes: notes || 'Baixa de pagamento'
                    }
                })
            }

            await tx.auditLog.create({
                data: {
                    userId: session.userId,
                    action: 'UPDATE',
                    resource: 'RECEIVABLE',
                    details: `Pagamento registrado para conta ${id}: ${receivedAmount / 100}`
                }
            })

            return rec
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar pagamento' }, { status: 500 })
    }
}
