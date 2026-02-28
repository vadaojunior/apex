import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    try {
        const where: any = {}
        if (status && status !== 'ALL') where.status = status

        const [receivables, total] = await Promise.all([
            prisma.receivable.findMany({
                where,
                include: { client: true, sale: true },
                orderBy: { dueDate: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.receivable.count({ where })
        ])

        return ApiResponse.success({
            receivables,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar contas a receber')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, receivedAmount, notes, status } = body

        const receivable = await prisma.receivable.findUnique({
            where: { id }
        })

        if (!receivable) return ApiResponse.notFound('Conta não encontrada')

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

            return rec
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.PAYMENT,
            resource: AuditResource.RECEIVABLE,
            entityId: id,
            details: `Pagamento de ${receivedAmount / 100} registrado. Status: ${newStatus}`,
            oldValue: receivable,
            newValue: updated
        })

        return ApiResponse.success(updated)
    } catch (error) {
        console.error('Update payment error:', error)
        return ApiResponse.serverError('Erro ao atualizar pagamento')
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return ApiResponse.error('ID da conta a receber é obrigatório', 400)

        const oldReceivable = await prisma.receivable.findUnique({
            where: { id }
        })

        if (!oldReceivable) return ApiResponse.notFound('Conta a receber não encontrada')

        await prisma.$transaction(async (tx) => {
            // Remove associated payment records first
            await tx.paymentRecord.deleteMany({
                where: { receivableId: id }
            })

            // Delete the receivable
            await tx.receivable.delete({
                where: { id }
            })
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.DELETE,
            resource: AuditResource.RECEIVABLE,
            entityId: id,
            details: `Conta a receber excluída: ${oldReceivable.description}`,
            oldValue: oldReceivable
        })

        return ApiResponse.success({ success: true })
    } catch (error) {
        console.error('Delete receivable error:', error)
        return ApiResponse.serverError('Erro ao excluir conta a receber')
    }
}
