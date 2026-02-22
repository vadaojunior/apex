import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})


async function main() {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'change-me-later'
    const hashedPassword = await bcrypt.hash(initialPassword, 10)

    // 1. Create Admin User
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'Administrador APEX',
            role: 'ADMIN',
        },
    })

    console.log('Admin user created/verified')

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

    console.log('Default services created/verified')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
