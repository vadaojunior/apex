const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

const prisma = new PrismaClient({})


async function main() {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'change-me-later'
    const hashedPassword = await bcrypt.hash(initialPassword, 10)

    console.log('Iniciando seed (JS)...')

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
}

main()
    .catch((e) => {
        console.error('Erro no seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
