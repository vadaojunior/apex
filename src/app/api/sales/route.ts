import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
        }

        const {
            clientId,
            items,
            discount = 0,
            paymentMethod,
            installments = 1,
            paymentStatus, // 'PAID' or 'OPEN'
            dueDate,
            notes
        } = await request.json()

        if (!clientId || !items || items.length === 0) {
            return NextResponse.json({ message: 'Dados da venda incompletos' }, { status: 400 })
        }

        // Calculate total
        let totalAmount = 0
        const saleItemsData = items.map((item: any) => {
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

        // Create Sale and Receivable in a transaction
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
                }
            })

            // Generate Receivable
            const receivable = await tx.receivable.create({
                data: {
                    saleId: sale.id,
                    clientId,
                    description: `Venda #${sale.id.slice(-6).toUpperCase()}`,
                    amount: finalAmount,
                    receivedAmount: paymentStatus === 'PAID' ? finalAmount : 0,
                    dueDate: new Date(dueDate || new Date()),
                    status: paymentStatus === 'PAID' ? 'PAID' : 'OPEN',
                    paymentMethod,
                    installments: paymentMethod === 'CREDIT_CARD' ? installments : 1,
                    // Tax logic would go here if we had the config
                }
            })

            // Create Payment History if paid
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

            // Log the action
            await tx.auditLog.create({
                data: {
                    userId: session.userId,
                    action: 'CREATE',
                    resource: 'SALE',
                    details: `Venda criada: ID ${sale.id}, Total: ${finalAmount / 100}`
                }
            })

            return { sale, receivable }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Erro ao criar venda:', error)
        return NextResponse.json({ message: 'Erro interno ao processar venda' }, { status: 500 })
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
        return NextResponse.json(sales)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar vendas' }, { status: 500 })
    }
}
