import fs from 'fs';
async function test() {
    console.log('Logging in...')
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: '123' })
    })
    const cookies = loginRes.headers.get('set-cookie')

    console.log('Sending duplicate payload...')
    const srv1 = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies || ''
        },
        body: JSON.stringify({
            name: 'Service Testing 12345',
            price: 15000,
            description: 'Desc'
        })
    })

    console.log(`STATUS: ${srv1.status}`)
    const text1 = await srv1.text()
    console.log(`BODY:\n${text1}`)
}
test()
