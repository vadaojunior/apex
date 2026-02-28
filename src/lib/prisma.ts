import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    try {
        return new PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
            log: ['query', 'info', 'warn', 'error'],
        })
    } catch (err: any) {
        console.error('FATAL PRISMA INIT ERROR:', err)
        // Re-throw to be caught by route handlers
        throw err
    }
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
