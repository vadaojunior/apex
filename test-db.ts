import prisma from './src/lib/prisma'

async function test() {
    console.log('--- DIAGNÓSTICO DE BANCO (PRISMA 7) ---')
    try {
        const clientsCount = await prisma.client.count()
        console.log(`Sucesso! Clientes no banco: ${clientsCount}`)

        const servicesCount = await prisma.service.count()
        console.log(`Sucesso! Serviços no banco: ${servicesCount}`)
    } catch (err: any) {
        console.error('ERRO DE CONEXÃO:', err.message)
    } finally {
        await (prisma as any).$disconnect?.()
    }
}

test()
