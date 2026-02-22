import prisma from './src/lib/prisma'

async function test() {
    console.log('Testando conexão com o banco de dados...')
    try {
        const clientsCount = await prisma.client.count()
        console.log(`Sucesso! Encontrados ${clientsCount} clientes.`)

        const servicesCount = await prisma.service.count()
        console.log(`Sucesso! Encontrados ${servicesCount} serviços.`)
    } catch (err) {
        console.error('Erro ao conectar ao Prisma:', err)
    }
}

test()
