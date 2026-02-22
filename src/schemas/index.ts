import { z } from 'zod'

export const ClientSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email('E-mail inválido').or(z.literal('')).optional().nullable(),
})

export const ServiceSchema = z.object({
    name: z.string().min(1, 'Nome do serviço é obrigatório'),
    description: z.string().optional().nullable(),
    price: z.number().int().min(0, 'O preço deve ser positivo (em centavos)'),
})

export const SaleSchema = z.object({
    clientId: z.string().min(1, 'Cliente é obrigatório'),
    items: z.array(z.object({
        serviceId: z.string(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().int(),
        totalPrice: z.number().int(),
    })).min(1, 'Adicione pelo menos um serviço'),
    discount: z.number().int().default(0),
    paymentMethod: z.enum(['CASH', 'BOLETO', 'CREDIT_CARD']),
    installments: z.number().int().min(1).default(1),
    paymentStatus: z.enum(['PAID', 'OPEN', 'CANCELLED']),
    notes: z.string().optional().nullable(),
})

export const ReceivableSchema = z.object({
    status: z.enum(['OPEN', 'PAID', 'OVERDUE', 'CANCELLED']),
    receivedAmount: z.number().int().min(0),
    dueDate: z.date().or(z.string().datetime()),
})

export const PayableSchema = z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    amount: z.number().int().min(1, 'Valor deve ser positivo'),
    dueDate: z.date().or(z.string().datetime()),
    status: z.enum(['OPEN', 'PAID', 'OVERDUE', 'CANCELLED']),
})
