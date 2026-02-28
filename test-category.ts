import prisma from '@/lib/prisma'

async function testExpenseCategoryCreation() {
    try {
        console.log('Testing successful creation...')
        const category1 = await prisma.expenseCategory.create({
            data: {
                name: 'Test Category 1',
                color: '#ff0000',
            }
        })
        console.log('Success:', category1)

        console.log('Testing duplicate name creation (should fail)...')
        try {
            await prisma.expenseCategory.create({
                data: {
                    name: 'Test Category 1',
                    color: '#00ff00',
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
        await prisma.expenseCategory.deleteMany({
            where: { name: 'Test Category 1' }
        })
        await (prisma as any).$disconnect?.()
    }
}

testExpenseCategoryCreation()
