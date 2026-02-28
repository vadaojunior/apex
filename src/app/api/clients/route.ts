import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { ClientSchema } from '@/schemas'

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' }
        })
        return ApiResponse.success(clients)
    } catch (error: any) {
        console.error('API CLIENTS ERROR:', error)
        return ApiResponse.serverError(`Erro ao buscar clientes: ${error.message || 'Erro desconhecido'}`)
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const validatedData = ClientSchema.parse(body)

        const client = await prisma.client.create({
            data: validatedData
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.CREATE,
            resource: AuditResource.CLIENT,
            entityId: client.id,
            details: `Cliente criado: ${client.name}`,
            newValue: client
        })

        return ApiResponse.success(client, 201)
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return ApiResponse.error('Dados inválidos', 400, error.errors)
        }
        return ApiResponse.serverError('Erro ao criar cliente')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, ...updateDataRaw } = body

        if (!id) {
            return ApiResponse.error('ID do cliente é obrigatório', 400)
        }

        // Convert empty strings to null for optional database fields
        const updateData = {
            name: updateDataRaw.name,
            cpf: updateDataRaw.cpf || null,
            phone: updateDataRaw.phone || null,
            email: updateDataRaw.email || null,
            govPassword: updateDataRaw.govPassword || null,
        }

        const oldClient = await prisma.client.findUnique({
            where: { id }
        })

        if (!oldClient) {
            return ApiResponse.notFound('Cliente não encontrado')
        }

        const client = await prisma.client.update({
            where: { id },
            data: updateData
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: AuditResource.CLIENT,
            entityId: client.id,
            details: `Cliente atualizado: ${client.name}`,
            oldValue: JSON.stringify(oldClient),
            newValue: JSON.stringify(client)
        })

        return ApiResponse.success(client)
    } catch (error) {
        return ApiResponse.serverError('Erro ao atualizar cliente')
    }
}
