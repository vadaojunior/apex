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
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar clientes')
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
