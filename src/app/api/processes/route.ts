import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const processes = await prisma.clientService.findMany({
            include: {
                client: true,
                service: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return ApiResponse.success(processes)
    } catch (error) {
        console.error('Erro ao buscar processos:', error)
        return ApiResponse.serverError('Erro ao buscar processos em andamento')
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { id, status, notes } = body

        if (!id) return ApiResponse.error('ID do processo é obrigatório', 400)

        const updated = await prisma.clientService.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes && { notes })
            }
        })

        return ApiResponse.success(updated)
    } catch (error) {
        console.error('Erro ao atualizar processo:', error)
        return ApiResponse.serverError('Erro ao atualizar processo')
    }
}
