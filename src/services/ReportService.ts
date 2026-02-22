import prisma from '@/lib/prisma'

export interface FinancialReport {
    revenue: number
    expenses: number
    profit: number
    overdueAmount: number
    openAmount: number
}

export class ReportService {
    static async getFinancialSummary(startDate?: Date, endDate?: Date): Promise<FinancialReport> {
        // Receita: Somatório de PaymentRecords (recebimentos reais no caixa)
        const payments = await prisma.paymentRecord.aggregate({
            _sum: { amount: true },
            where: startDate || endDate ? {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            } : {}
        })

        // Despesas: Somatório de Payables PAGOS (saídas reais)
        const expenses = await prisma.payable.aggregate({
            _sum: { amount: true },
            where: {
                status: 'PAID',
                ...(startDate || endDate ? {
                    dueDate: {
                        gte: startDate,
                        lte: endDate
                    }
                } : {})
            }
        })

        // Inadimplência: Receivables vencidos (valor total que deveria ter entrado)
        const overdue = await prisma.receivable.aggregate({
            _sum: { amount: true },
            where: {
                status: 'OVERDUE'
            }
        })

        // Aberto: Receivables em aberto (vencimento futuro)
        const open = await prisma.receivable.aggregate({
            _sum: { amount: true },
            where: {
                status: 'OPEN'
            }
        })

        const revenueAmount = payments._sum.amount || 0
        const expenseAmount = expenses._sum.amount || 0

        return {
            revenue: revenueAmount,
            expenses: expenseAmount,
            profit: revenueAmount - expenseAmount,
            overdueAmount: overdue._sum.amount || 0,
            openAmount: open._sum.amount || 0
        }
    }

    static async getRevenueByService() {
        // Rank de serviços por faturamento
        const saleItems = await prisma.saleItem.groupBy({
            by: ['serviceId'],
            _sum: {
                totalPrice: true
            },
            orderBy: {
                _sum: {
                    totalPrice: 'desc'
                }
            }
        })

        // Buscar nomes dos serviços para o relatório
        const services = await prisma.service.findMany({
            where: {
                id: { in: saleItems.map(item => item.serviceId) }
            }
        })

        return saleItems.map(item => ({
            serviceName: services.find(s => s.id === item.serviceId)?.name || 'Desconhecido',
            totalValue: item._sum.totalPrice || 0
        }))
    }
}
