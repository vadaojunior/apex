import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { ServiceSchema } from '@/schemas'

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
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
            data: validatedData
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
        return ApiResponse.serverError('Erro ao criar serviço')
    }
}
