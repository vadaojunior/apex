import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
    interval: 60000, // 60 segundos
    uniqueTokenPerInterval: 500 // Limite de 500 IPs monitorados simultaneamente
})

export async function POST(request: Request) {
    try {
        // Tentar obter o IP da requisição para o limite, caso não consiga, fazer fallback
        const ip = request.headers.get('x-forwarded-for') || 'unknown'

        try {
            // Máximo de 5 tentativas por IP a cada 1 minuto
            await limiter.check(5, ip)
        } catch {
            return ApiResponse.error('Muitas tentativas de login excedidas. Bloqueio de segurança acionado. Tente novamente mais tarde.', 429)
        }

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
    } catch (error: any) {
        // Fallback logging for investigation
        const fs = require('fs')
        const logMsg = `[LOGIN ERROR] ${new Date().toISOString()} - ${error?.message}\n${error?.stack}\n\n`
        fs.appendFileSync('login-debug.log', logMsg)

        console.error('ERRO CRÍTICO NO LOGIN:', error)
        return ApiResponse.serverError()
    }
}
