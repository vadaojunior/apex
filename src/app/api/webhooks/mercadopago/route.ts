import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'

// O Mercado Pago envia notificações via POST
export async function POST(request: Request) {
    try {
        const url = new URL(request.url)
        console.log(`[Webhook MP] Nova requisição recebida na query: ${url.search}`)

        const data = await request.json()
        const topic = data.type || url.searchParams.get('topic') || data.topic

        console.log(`[Webhook MP] Tópico: ${topic}`)

        // Registra o recebimento do webhook na nova tabela de integracoes
        try {
            await prisma.providerWebhook.create({
                data: {
                    provider: 'MERCADO_PAGO',
                    externalId: data?.data?.id || 'unknown',
                    payload: JSON.stringify(data),
                    status: 'RECEIVED'
                }
            })
        } catch (dbErr) {
            console.error('[Webhook MP] Erro ao salvar payload:', dbErr)
            // Não bloqueia o fluxo principal
        }

        // Se o tópico for de pagamento (payment), vamos buscar via API do Mercado Pago 
        // ou inferir usando nosso sistema local via o ID associado
        if (topic === 'payment') {
            const paymentId = data?.data?.id || url.searchParams.get('id')
            console.log(`[Webhook MP] Processando pagamento ID: ${paymentId}`)

            // Aqui seria a integração IDEAL refazendo GET pro Mercado Pago
            // Para fim de simplificação do nosso schema e já que o MP não retorna details no POST:
            // Dependendo do ambiente real, fazemos GET na API deles: /v1/payments/{paymentId}

            if (paymentId) {
                const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
                if (accessToken) {
                    try {
                        const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        })

                        if (mpResp.ok) {
                            const paymentData = await mpResp.json()
                            console.log(`[Webhook MP] Status do Pagamento MP: ${paymentData.status}`)

                            if (paymentData.status === 'approved') {
                                const receivableId = paymentData.external_reference

                                if (receivableId) {
                                    // Achei o pedido no meu banco
                                    const receivable = await prisma.receivable.findUnique({ where: { id: receivableId } })

                                    if (receivable && receivable.status !== 'PAID') {
                                        // Atualizar para pago
                                        await prisma.$transaction(async (tx) => {
                                            await tx.receivable.update({
                                                where: { id: receivableId },
                                                data: {
                                                    status: 'PAID',
                                                    receivedAmount: receivable.amount // Marcando como valor total pago
                                                }
                                            })

                                            await tx.paymentRecord.create({
                                                data: {
                                                    receivableId: receivableId,
                                                    amount: receivable.amount, // Valor em centavos
                                                    notes: `Baixa via Webhook Mercado Pago. MP ID: ${paymentId}`
                                                }
                                            })
                                        })

                                        // Registra como "Sistema" (sem session.userId)
                                        await AuditService.log({
                                            userId: 'SYSTEM_WEBHOOK',
                                            action: AuditAction.PAYMENT,
                                            resource: AuditResource.RECEIVABLE,
                                            entityId: receivableId,
                                            details: `Baixa automática Webhook MP do pagamento ${paymentId}`,
                                            newValue: 'PAID'
                                        })
                                        console.log(`[Webhook MP] Conta a receber ${receivableId} paga com sucesso.`)
                                    } else {
                                        console.log(`[Webhook MP] Conta ${receivableId} já está paga ou não foi encontrada.`)
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error('[Webhook MP] Erro ao checar Payment Data do Mercado Pago:', err)
                    }
                } else {
                    console.warn('[Webhook MP] MERCADOPAGO_ACCESS_TOKEN não configurado.')
                }
            }
        }

        // Na documentação do MP dizem que sempre devemos responder HTTP 200 (OK) rápido.
        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('[Webhook MP] Erro não mapeado:', error)
        return new NextResponse(JSON.stringify({ error: 'Webhook processing error' }), {
            status: 200, // MercadoPago expects 200 or 201 to acknowledge receipt
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
