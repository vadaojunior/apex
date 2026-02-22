import { NextResponse } from 'next/server'

export class ApiResponse {
    static success(data: any, status = 200) {
        return NextResponse.json(data, { status })
    }

    static error(message: string, status = 400, details?: any) {
        return NextResponse.json(
            {
                message,
                details,
                timestamp: new Date().toISOString(),
            },
            { status }
        )
    }

    static unauthorized(message = 'Não autorizado') {
        return this.error(message, 401)
    }

    static forbidden(message = 'Acesso negado') {
        return this.error(message, 403)
    }

    static notFound(message = 'Recurso não encontrado') {
        return this.error(message, 404)
    }

    static serverError(message = 'Erro interno no servidor') {
        return this.error(message, 500)
    }
}
