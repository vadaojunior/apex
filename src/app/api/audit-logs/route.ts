import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const { searchParams } = new URL(request.url)
        const resource = searchParams.get('resource')
        const action = searchParams.get('action')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = 50

        const where: any = {}
        if (resource) where.resource = resource
        if (action) where.action = action

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.auditLog.count({ where })
        ])

        return ApiResponse.success({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Audit Logs API Error:', error)
        return ApiResponse.serverError('Erro ao buscar logs')
    }
}
