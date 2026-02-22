import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export interface UserPayload {
    userId: string
    username: string
    name: string
    role: string
}


export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}

export async function createSession(payload: UserPayload) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' })

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8 // 8 hours
    })
}

export async function getSession(): Promise<UserPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('session')?.value
        if (!token) return null

        return jwt.verify(token, JWT_SECRET) as UserPayload
    } catch (error) {
        return null
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
