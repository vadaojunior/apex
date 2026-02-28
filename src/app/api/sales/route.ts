import { ApiResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { AuditService, AuditAction, AuditResource } from '@/services/AuditService'
import { SaleSchema } from '@/schemas'

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const body = await request.json()
        const validatedData = SaleSchema.parse(body)

        const {
            clientId,
            items,
            discount,
            paymentMethod,
            installments,
            paymentStatus,
            notes
        } = validatedData

        // Calculate total on server side for safety
        let totalAmount = 0
        const saleItemsData = items.map(item => {
            const totalPrice = item.quantity * item.unitPrice
            totalAmount += totalPrice
            return {
                serviceId: item.serviceId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: totalPrice
            }
        })

        const finalAmount = totalAmount - discount

        const result = await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    clientId,
                    totalAmount: finalAmount,
                    discount,
                    notes,
                    items: {
                        create: saleItemsData
                    }
                },
                include: { items: true }
            })

            const receivable = await tx.receivable.create({
                data: {
                    saleId: sale.id,
                    clientId,
                    description: `Venda #${sale.id.slice(-6).toUpperCase()}`,
                    amount: finalAmount,
                    receivedAmount: paymentStatus === 'PAID' ? finalAmount : 0,
                    dueDate: new Date(),
                    status: paymentStatus === 'PAID' ? 'PAID' : 'OPEN',
                    paymentMethod,
                    installments: paymentMethod === 'CREDIT_CARD' ? installments : 1,
                }
            })

            // Generate Payables from ServiceExpenseTemplates and Create ClientServices (Processes)
            const servicesIds = Array.from(new Set(items.map(item => item.serviceId)))
            const servicesWithTemplates = await tx.service.findMany({
                where: { id: { in: servicesIds } },
                include: { expenseTemplates: true }
            })

            const payablesData: any[] = []
            const clientServicesData: any[] = []

            for (const item of items) {
                const service = servicesWithTemplates.find(s => s.id === item.serviceId)
                if (service && service.expenseTemplates.length > 0) {
                    for (let step = 0; step < item.quantity; step++) {
                        clientServicesData.push({
                            clientId: clientId,
                            serviceId: item.serviceId,
                            status: 'PENDING',
                            notes: `Gerado via Venda #${sale.id.slice(-6).toUpperCase()}`
                        })

                        for (const template of service.expenseTemplates) {
                            payablesData.push({
                                description: `${template.description} (${service.name} / Venda #${sale.id.slice(-6).toUpperCase()})`,
                                amount: template.amount,
                                clientId: clientId,
                                categoryId: template.categoryId,
                                dueDate: new Date(),
                                status: 'OPEN'
                            })
                        }
                    }
                }
            }

            if (clientServicesData.length > 0) {
                await tx.clientService.createMany({
                    data: clientServicesData
                })
            }

            if (payablesData.length > 0) {
                await tx.payable.createMany({
                    data: payablesData
                })
            }

            if (paymentStatus === 'PAID') {
                await tx.paymentRecord.create({
                    data: {
                        receivableId: receivable.id,
                        amount: finalAmount,
                        date: new Date(),
                        notes: 'Pagamento total no ato da venda'
                    }
                })
            }

            return { sale, receivable }
        })

        await AuditService.log({
            userId: session.userId,
            action: AuditAction.CREATE,
            resource: AuditResource.SALE,
            entityId: result.sale.id,
            details: `Venda registrada para cliente ID: ${clientId}`,
            newValue: result.sale
        })

        return ApiResponse.success(result, 201)
    } catch (error: any) {
        console.error('Erro ao criar venda:', error)
        if (error.name === 'ZodError') {
            return ApiResponse.error('Dados da venda inválidos', 400, error.errors)
        }
        return ApiResponse.serverError('Erro ao processar venda')
    }
}

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                client: true,
                items: {
                    include: {
                        service: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        })
        return ApiResponse.success(sales)
    } catch (error) {
        return ApiResponse.serverError('Erro ao buscar vendas')
    }
}
