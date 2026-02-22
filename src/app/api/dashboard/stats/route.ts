import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const now = new Date()
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        // Parallel fetching for performance
        const [
            clientsCount,
            activeProcesses,
            totalServices,
            monthReceivables,
            monthPayables,
            overdueReceivables
        ] = await Promise.all([
            prisma.client.count(),
            prisma.clientService.count({ where: { status: 'PENDING' } }),
            prisma.service.count(),
            prisma.receivable.findMany({
                where: {
                    dueDate: { gte: monthStart, lte: monthEnd }
                }
            }),
            prisma.payable.findMany({
                where: {
                    dueDate: { gte: monthStart, lte: monthEnd }
                }
            }),
            prisma.receivable.findMany({
                where: {
                    status: 'OPEN',
                    dueDate: { lt: now }
                }
            })
        ])

        // Summary calculations
        const revenue = monthReceivables
            .filter(r => r.status === 'PAID')
            .reduce((acc, r) => acc + r.receivedAmount, 0)

        const revenueToReceive = monthReceivables
            .filter(r => r.status !== 'PAID' && r.status !== 'CANCELLED')
            .reduce((acc, r) => acc + (r.amount - r.receivedAmount), 0)

        const expenses = monthPayables
            .filter(p => p.status === 'PAID')
            .reduce((acc, p) => acc + p.amount, 0)

        const overdueAmount = overdueReceivables.reduce((acc, r) => acc + (r.amount - r.receivedAmount), 0)

        return NextResponse.json({
            clientsCount,
            activeProcesses,
            totalServices,
            revenue,
            revenueToReceive,
            expenses,
            profit: revenue - expenses,
            overdueAmount,
            nextVencimentos: monthReceivables
                .filter(r => r.status === 'OPEN')
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .slice(0, 5)
        })
    } catch (error) {
        console.error('Dashboard Error:', error)
        return NextResponse.json({ message: 'Erro ao processar dados do dashboard' }, { status: 500 })
    }
}
