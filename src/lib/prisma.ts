import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const prismaClientSingleton = () => {
    try {
        const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'

        // Remover o prefixo 'file:' se existir
        let dbPath = rawUrl.replace(/^file:/, '')

        // Se o caminho for relativo, resolver a partir da raiz do projeto
        if (!path.isAbsolute(dbPath)) {
            dbPath = path.resolve(process.cwd(), dbPath)
        }

        const adapter = new PrismaBetterSqlite3({ url: dbPath })

        return new PrismaClient({
            adapter: adapter as any,
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
