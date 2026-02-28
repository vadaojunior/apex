import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const { receivableId } = body

        if (!receivableId) return ApiResponse.error('ID da conta a receber é obrigatório', 400)

        const receivable = await prisma.receivable.findUnique({
            where: { id: receivableId },
            include: { client: true }
        })

        if (!receivable) return ApiResponse.notFound('Conta a receber não encontrada')

        if (receivable.status === 'PAID') {
            return ApiResponse.error('Esta conta já está paga', 400)
        }

        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
        if (!accessToken) {
            console.error('MERCADOPAGO_ACCESS_TOKEN is not defined')
            return ApiResponse.serverError('Configuração do Mercado Pago ausente no servidor')
        }

        const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 10000 } })
        const preference = new Preference(client)

        const remainingAmount = (receivable.amount - receivable.receivedAmount) / 100 // em reais

        // Tratar email padrão para evitar erros na API do MP
        const clientEmail = receivable.client.email && receivable.client.email.trim() !== ''
            ? receivable.client.email
            : 'cliente@naoinformado.com'

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: receivable.id,
                        title: receivable.description,
                        quantity: 1,
                        unit_price: remainingAmount,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    name: receivable.client.name,
                    email: clientEmail,
                },
                external_reference: receivable.id,
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'}/api/webhooks/mercadopago`,
                auto_return: 'approved',
                statement_descriptor: 'APEX ASSESSORIA',
            }
        })

        // Save the external ID and provider for future references
        await prisma.receivable.update({
            where: { id: receivable.id },
            data: {
                provider: 'MERCADO_PAGO',
                externalId: response.id // The preference ID
            }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.UPDATE,
            resource: AuditResource.RECEIVABLE,
            entityId: receivable.id,
            details: `Link do Mercado Pago gerado (Pref: ${response.id})`,
            newValue: receivable
        })

        return ApiResponse.success({
            init_point: response.init_point, // Link do checkout
            preference_id: response.id
        })

    } catch (error) {
        console.error('Erro ao gerar link do Mercado Pago:', error)
        return ApiResponse.serverError('Erro ao gerar pagamento via Mercado Pago')
    }
}
