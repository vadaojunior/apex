import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createHmac } from 'crypto'

export async function POST(request: Request) {
    const signature = request.headers.get('x-webhook-signature')
    const body = await request.text()
    const secret = process.env.WEBHOOK_SECRET

    // Validação de assinatura HMAC (preparada para o futuro)
    if (secret && signature) {
        const hmac = createHmac('sha256', secret)
        const digest = hmac.update(body).digest('hex')

        if (signature !== digest) {
            return NextResponse.json({ message: 'Assinatura inválida' }, { status: 401 })
        }
    }

    try {
        const payload = JSON.parse(body)

        // Registrar webhook no banco para auditoria futura
        await prisma.providerWebhook.create({
            data: {
                provider: payload.provider || 'EXTERNAL',
                externalId: payload.id?.toString() || payload.external_id?.toString() || null,
                payload: body,
                status: 'RECEIVED'
            }
        })

        // Lógica preparada para atualização de recebíveis (Feature Flag implicita)
        // Se houver um externalId correspondente a um Receivable, poderíamos atualizar aqui.
        // const receivable = await prisma.receivable.findFirst({ where: { externalId: ... }})

        return NextResponse.json({ status: 'success', received: true })
    } catch (error) {
        console.error('Webhook process error:', error)
        return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 })
    }
}
