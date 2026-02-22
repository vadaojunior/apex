import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })

        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to last 100 for performance
        })
        return NextResponse.json(logs)
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar logs' }, { status: 500 })
    }
}
