import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { ServiceSchema } from '@/schemas'

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' },
            include: { expenseTemplates: { include: { category: true } } }
        })
        return ApiResponse.success(services)
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar serviços')
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const validatedData = ServiceSchema.parse(body)

        const service = await prisma.service.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                expenseTemplates: {
                    create: validatedData.expenseTemplates
                }
            },
            include: { expenseTemplates: true }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.CREATE,
            resource: AuditResource.SERVICE,
            entityId: service.id,
            details: `Serviço criado: ${service.name}`,
            newValue: service
        })

        return ApiResponse.success(service, 201)
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return ApiResponse.error('Dados inválidos', 400, error.errors)
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
            return ApiResponse.error('Já existe um serviço cadastrado com este nome', 400)
        }
        console.error('API /services POST Error:', error)
        return ApiResponse.serverError('Erro ao criar serviço')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return ApiResponse.error('ID do serviço é obrigatório', 400)
        }

        const oldService = await prisma.service.findUnique({
            where: { id },
            include: { expenseTemplates: true }
        })

        if (!oldService) {
            return ApiResponse.notFound('Serviço não encontrado')
        }

        const validatedData = ServiceSchema.parse(updateData)

        // For simplicity, we delete existing templates and recreate the new ones
        const service = await prisma.$transaction(async (tx) => {
            await tx.serviceExpenseTemplate.deleteMany({
                where: { serviceId: id }
            })

            return tx.service.update({
                where: { id },
                data: {
                    name: validatedData.name,
                    description: validatedData.description || null,
                    price: validatedData.price,
                    expenseTemplates: {
                        create: validatedData.expenseTemplates
                    }
                },
                include: { expenseTemplates: true }
            })
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: AuditResource.SERVICE,
            entityId: service.id,
            details: `Serviço atualizado: ${service.name}`,
            oldValue: JSON.stringify(oldService),
            newValue: JSON.stringify(service)
        })

        return ApiResponse.success(service)
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return ApiResponse.error('Dados inválidos', 400, error.errors)
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
            return ApiResponse.error('Já existe um serviço cadastrado com este nome', 400)
        }
        console.error('API /services PATCH Error:', error)
        return ApiResponse.serverError('Erro ao atualizar serviço')
    }
}
