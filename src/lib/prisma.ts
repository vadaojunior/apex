import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const prismaClientSingleton = () => {
    try {
        // Obter o caminho do banco removendo 'file:' se existir
        const rawUrl = process.env.DATABASE_URL || 'prisma/dev.db'
        const dbPath = rawUrl.replace('file:', '')

        const adapter = new PrismaBetterSqlite3({ url: dbPath })

        return new PrismaClient({
            adapter,
            log: ['query', 'info', 'warn', 'error'],
        })
    } catch (err: any) {
        console.error('FATAL PRISMA INIT ERROR:', err)
        throw err
    }
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
