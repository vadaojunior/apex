import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return ApiResponse.error('Usuário e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            await AuditService.log({
                action: AuditAction.LOGIN,
                resource: AuditResource.USER,
                details: `Tentativa de login falha: usuário ${username} não encontrado.`
            })
            return ApiResponse.unauthorized('Credenciais inválidas')
        }

        const isPasswordValid = await verifyPassword(password, user.password)

        if (!isPasswordValid) {
            await AuditService.log({
                userId: user.id,
                action: AuditAction.LOGIN,
                resource: AuditResource.USER,
                details: `Tentativa de login falha: senha incorreta para ${username}.`
            })
            return ApiResponse.unauthorized('Credenciais inválidas')
        }

        await createSession({
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        })

        await AuditService.log({
            userId: user.id,
            action: AuditAction.LOGIN,
            resource: AuditResource.USER,
            details: `Usuário ${username} logado com sucesso.`
        })

        return ApiResponse.success({ message: 'Login realizado com sucesso' })
    } catch (error) {
        console.error('ERRO CRÍTICO NO LOGIN:', error)
        return ApiResponse.serverError()
    }
}
