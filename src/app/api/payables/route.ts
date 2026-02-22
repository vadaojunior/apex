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
                ...validatedData,
                isRecurring: body.isRecurring || false,
                recurrenceInterval: body.recurrenceInterval
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

        const { id, status } = await request.json()

        const oldPayable = await prisma.payable.findUnique({ where: { id } })
        if (!oldPayable) return ApiResponse.notFound()

        const updated = await prisma.payable.update({
            where: { id },
            data: { status }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: AuditResource.PAYABLE,
            entityId: id,
            details: `Status alterado para ${status}`,
            oldValue: oldPayable,
            newValue: updated
        })

        return ApiResponse.success(updated)
    } catch (error) {
        return ApiResponse.serverError('Erro ao atualizar conta a pagar')
    }
}
