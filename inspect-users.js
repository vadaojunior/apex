const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    console.log('--- DB INSPECTION START ---')
    try {
        const users = await prisma.user.findMany()
        console.log('Users found:', users.length)
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`)
        })
    } catch (err) {
        console.log('--- ERROR FOUND ---')
        console.log('Message:', err.message)
        console.log('Code:', err.code)
        console.log('Stack:', err.stack)
        console.error('FULL ERROR:', err)
    } finally {
        await prisma.$disconnect()
    }
}

check()
