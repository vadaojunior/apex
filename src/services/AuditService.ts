import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export enum AuditAction {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    CANCEL = 'CANCEL',
    PAYMENT = 'PAYMENT',
    DELETE = 'DELETE'
}

export enum AuditResource {
    USER = 'USER',
    CLIENT = 'CLIENT',
    SERVICE = 'SERVICE',
    RECEIVABLE = 'RECEIVABLE',
    PAYABLE = 'PAYABLE',
    CONFIG = 'CONFIG',
    SALE = 'SALE'
}

export class AuditService {
    static async log(params: {
        userId?: string
        action: AuditAction | string
        resource: AuditResource | string
        details?: string
        entityId?: string
        oldValue?: any
        newValue?: any
    }) {
        try {
            let ip = '127.0.0.1'
            let userAgent = 'unknown'

            try {
                const headerList = await headers()
                ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
                userAgent = headerList.get('user-agent') || 'unknown'
            } catch (hError) {
                console.warn('Não foi possível obter headers para auditoria:', hError)
            }

            await prisma.auditLog.create({
                data: {
                    userId: params.userId,
                    action: params.action,
                    resource: params.resource,
                    details: params.details,
                    entityId: params.entityId,
                    ip,
                    userAgent,
                    oldValue: params.oldValue ? JSON.stringify(params.oldValue, null, 2) : null,
                    newValue: params.newValue ? JSON.stringify(params.newValue, null, 2) : null,
                }
            })
        } catch (error) {
            console.error('Audit Log Error:', error)
            // Fail silently to not break the main transaction
        }
    }
}
