import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { PayableSchema } from '@/schemas'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    try {
        const [payables, total] = await Promise.all([
            prisma.payable.findMany({
                orderBy: { dueDate: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { category: true, client: true } // Include category and client details
            }),
            prisma.payable.count()
        ])

        return ApiResponse.success({
            payables,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar contas a pagar')
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const validatedData = PayableSchema.parse({
            ...body,
            dueDate: new Date(body.dueDate)
        })

        const payable = await prisma.payable.create({
            data: {
                ...validatedData
            }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.CREATE,
            resource: AuditResource.PAYABLE,
            entityId: payable.id,
            details: `Conta a pagar criada: ${payable.description}`,
            newValue: payable
        })

        return ApiResponse.success(payable, 201)
    } catch (error: any) {
        if (error.name === 'ZodError') return ApiResponse.error('Dados inválidos', 400, error.errors)
        return ApiResponse.serverError('Erro ao criar conta a pagar')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, status, description, categoryId, amount, dueDate, clientId } = body

        if (!id) return ApiResponse.error('ID é obrigatório', 400)

        const oldPayable = await prisma.payable.findUnique({ where: { id } })
        if (!oldPayable) return ApiResponse.notFound()

        // Allow partial updates for status toggle or full updates from edit modal
        const updateData: any = {}
        if (status !== undefined) updateData.status = status
        if (description !== undefined) updateData.description = description
        if (categoryId !== undefined) updateData.categoryId = categoryId
        if (amount !== undefined) updateData.amount = amount
        if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
        if (clientId !== undefined) updateData.clientId = clientId

        const updated = await prisma.payable.update({
            where: { id },
            data: updateData
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: AuditResource.PAYABLE,
            entityId: id,
            details: `Conta a pagar atualizada: ${updated.description}`,
            oldValue: oldPayable,
            newValue: updated
        })

        return ApiResponse.success(updated)
    } catch (error) {
        return ApiResponse.serverError('Erro ao atualizar conta a pagar')
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return ApiResponse.error('ID da conta a pagar é obrigatório', 400)

        const oldPayable = await prisma.payable.findUnique({
            where: { id }
        })

        if (!oldPayable) return ApiResponse.notFound('Conta a pagar não encontrada')

        await prisma.payable.delete({
            where: { id }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.DELETE,
            resource: AuditResource.PAYABLE,
            entityId: id,
            details: `Conta a pagar excluída: ${oldPayable.description}`,
            oldValue: oldPayable
        })

        return ApiResponse.success({ success: true })
    } catch (error) {
        return ApiResponse.serverError('Erro ao excluir conta a pagar')
    }
}
