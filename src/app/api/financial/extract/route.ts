import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfDay, endOfDay, parseISO } from 'date-fns'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const startStr = searchParams.get('start')
        const endStr = searchParams.get('end')

        const where: any = {}
        if (startStr && endStr) {
            where.dueDate = {
                gte: startOfDay(parseISO(startStr)),
                lte: endOfDay(parseISO(endStr))
            }
        }

        const [receivables, payables] = await Promise.all([
            prisma.receivable.findMany({
                where,
                include: { client: true },
                orderBy: { dueDate: 'asc' }
            }),
            prisma.payable.findMany({
                where,
                orderBy: { dueDate: 'asc' }
            })
        ])

        // Standardize both into a unified "Transaction" format
        const transactions = [
            ...receivables.map(r => ({
                id: r.id,
                date: r.dueDate,
                description: `RECEBIMENTO: ${r.description} (${r.client.name})`,
                amount: r.amount,
                type: 'INCOME',
                status: r.status,
                method: r.paymentMethod
            })),
            ...payables.map(p => ({
                id: p.id,
                date: p.dueDate,
                description: `DESPESA: ${p.description}`,
                amount: p.amount,
                type: 'EXPENSE',
                status: p.status,
                method: 'Outros'
            }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        return NextResponse.json(transactions)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar extrato' }, { status: 500 })
    }
}
