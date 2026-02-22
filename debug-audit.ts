import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking AuditLog table...')
        const count = await prisma.auditLog.count()
        console.log('Current AuditLog count:', count)

        console.log('Trying to create a test log...')
        const testLog = await prisma.auditLog.create({
            data: {
                action: 'TEST',
                resource: 'DEBUG',
                details: 'Testing log creation with entityId',
                ip: '127.0.0.1',
                entityId: 'test-entity-123'
            }
        })
        console.log('Test log created successfully:', testLog.id)
    } catch (err) {
        console.error('ERROR during debug:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
