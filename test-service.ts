import prisma from '@/lib/prisma'

async function testServiceCreation() {
    try {
        console.log('Testing successful creation...')
        const service1 = await prisma.service.create({
            data: {
                name: 'Test Service 1',
                price: 15000,
            }
        })
        console.log('Success:', service1)

        console.log('Testing duplicate name creation (should fail)...')
        try {
            await prisma.service.create({
                data: {
                    name: 'Test Service 1',
                    price: 20000,
                }
            })
            console.log('ERROR: Should have failed uniqueness check!')
        } catch (err: any) {
            console.log('Caught expected error:')
            console.log('Error Code:', err.code)
            console.log('Error Meta:', err.meta)
            if (err.code === 'P2002' && err.meta?.target?.includes('name')) {
                console.log('Duplicate name check passed!')
            } else {
                console.log('Unexpected error type:', err)
            }
        }

    } catch (e) {
        console.error('Test script error:', e)
    } finally {
        // Cleanup
        await prisma.service.deleteMany({
            where: { name: 'Test Service 1' }
        })
        await (prisma as any).$disconnect?.()
    }
}

testServiceCreation()
