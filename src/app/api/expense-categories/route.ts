import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { z } from 'zod'

const ExpenseCategorySchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    color: z.string().optional()
})

export async function GET() {
    try {
        const categories = await prisma.expenseCategory.findMany({
            orderBy: { name: 'asc' }
        })
        return ApiResponse.success(categories)
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar categorias')
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const validatedData = ExpenseCategorySchema.parse(body)

        const category = await prisma.expenseCategory.create({
            data: {
                name: validatedData.name,
                color: validatedData.color || '#6b7280'
            }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.CREATE,
            resource: 'EXPENSE_CATEGORY' as AuditResource,
            entityId: category.id,
            details: `Categoria de despesa criada: ${category.name}`,
            newValue: category
        })

        return ApiResponse.success(category, 201)
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return ApiResponse.error('Dados inválidos', 400, error.errors)
        }
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return ApiResponse.error('Já existe uma categoria com este nome', 400)
        }
        return ApiResponse.serverError('Erro ao criar categoria')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return ApiResponse.error('ID da categoria é obrigatório', 400)
        }

        const oldCategory = await prisma.expenseCategory.findUnique({
            where: { id }
        })

        if (!oldCategory) {
            return ApiResponse.notFound('Categoria não encontrada')
        }

        const category = await prisma.expenseCategory.update({
            where: { id },
            data: updateData
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: 'EXPENSE_CATEGORY' as AuditResource,
            entityId: category.id,
            details: `Categoria de despesa atualizada: ${category.name}`,
            oldValue: JSON.stringify(oldCategory),
            newValue: JSON.stringify(category)
        })

        return ApiResponse.success(category)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return ApiResponse.error('Já existe uma categoria com este nome', 400)
        }
        return ApiResponse.serverError('Erro ao atualizar categoria')
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return ApiResponse.error('ID da categoria é obrigatório', 400)
        }

        // Check if there are any payables using this category
        const payablesCount = await prisma.payable.count({
            where: { categoryId: id }
        })

        if (payablesCount > 0) {
            return ApiResponse.error('Não é possível excluir uma categoria que possui contas vinculadas', 400)
        }

        const oldCategory = await prisma.expenseCategory.findUnique({
            where: { id }
        })

        if (!oldCategory) {
            return ApiResponse.notFound('Categoria não encontrada')
        }

        await prisma.expenseCategory.delete({
            where: { id }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.DELETE,
            resource: 'EXPENSE_CATEGORY' as AuditResource,
            entityId: id,
            details: `Categoria de despesa excluída: ${oldCategory.name}`,
            oldValue: JSON.stringify(oldCategory)
        })

        return ApiResponse.success({ success: true })
    } catch (error) {
        return ApiResponse.serverError('Erro ao excluir categoria')
    }
}
