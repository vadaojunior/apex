import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

// Let Prisma 7 handle the connection via prisma.config.ts or env auto-loading
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'change-me-later'
    const hashedPassword = await bcrypt.hash(initialPassword, 10)

    console.log('Iniciando seed...')

    // 1. Create Admin User
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'Administrador APEX',
            role: 'ADMIN',
        },
    })

    console.log('Usuário admin criado/verificado.')

    // 2. Create Default Services
    const defaultServices = [
        { name: 'Emissão de CR', description: 'Certificado de Registro' },
        { name: 'CRAF', description: 'Certificado de Registro de Arma de Fogo' },
        { name: 'Guia de Tráfego', description: 'Autorização para transporte' },
        { name: 'Autorização IBAMA', description: 'Processos vinculados ao IBAMA' },
        { name: 'Apostilamento', description: 'Inclusão ou alteração de dados no CR' },
        { name: 'Processo de Aquisição de Arma de Fogo', description: 'Autorização para compra' },
    ]

    for (const service of defaultServices) {
        await prisma.service.upsert({
            where: { name: service.name },
            update: {},
            create: service,
        })
    }

    console.log('Serviços padrão criados/verificados.')

    // 3. Create Default Expense Categories
    const defaultCategories = [
        { name: 'Infraestrutura e Software', color: '#3b82f6' },
        { name: 'Marketing e Publicidade', color: '#10b981' },
        { name: 'Folha de Pagamento', color: '#f59e0b' },
        { name: 'Impostos e Taxas', color: '#ef4444' },
        { name: 'Materiais de Escritório', color: '#8b5cf6' },
        { name: 'Outras Despesas', color: '#6b7280' },
    ]

    for (const cat of defaultCategories) {
        await prisma.expenseCategory.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        })
    }

    console.log('Categorias de despesas padrão criadas/verificadas.')
}

main()
    .catch((e) => {
        console.error('Erro no seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
