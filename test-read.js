const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- TEST READ START ---')
    try {
        const clients = await prisma.client.findMany()
        console.log('SUCCESS: Read Client table. Count:', clients.length)
    } catch (err) {
        console.error('ERROR reading root/configured DB:', err.message)
        if (err.message.includes('does not exist in the current database')) {
            console.log('HINT: The table is missing. The database might be empty.')
        }
    }
}

main()
    .catch((e) => console.error('CRITICAL ERROR:', e))
    .finally(async () => {
        await prisma.$disconnect()
    })
