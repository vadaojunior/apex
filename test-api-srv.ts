import fs from 'fs';
async function test() {
    console.log('Logging in...')
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: '123' })
    })
    const cookies = loginRes.headers.get('set-cookie')

    console.log('Sending exact UI payload...')
    const srv1 = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies || ''
        },
        // The UI sends price as cents: `Math.round(parseFloat(price.replace(',', '.')) * 100)`
        // BUT what happens if `price` is "" empty or a weird string? `NaN`
        // Or what if expenseTemplates are sent incorrectly? 
        body: JSON.stringify({
            name: "Testing 500 Route UI Crash",
            description: "",
            price: NaN, // Lets trigger a possible 500 crash here if Zod isn't catching NaN properly
            expenseTemplates: []
        })
    })

    console.log(`STATUS: ${srv1.status}`)
    const text1 = await srv1.text()
    console.log(`BODY:\n${text1}`)
}
test()
