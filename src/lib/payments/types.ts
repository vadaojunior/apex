export interface CreateChargePayload {
    amount: number // em centavos
    description: string
    paymentMethod: 'BOLETO' | 'CREDIT_CARD'
    installments?: number
    client: {
        name: string
        cpf?: string
        email?: string
        phone?: string
    }
}

export interface ChargeResponse {
    externalId: string
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'ERROR'
    paymentUrl?: string
    barcode?: string
    linhaDigitavel?: string
    rawResponse?: any
}

export interface PaymentProviderInterface {
    createCharge(payload: CreateChargePayload): Promise<ChargeResponse>
    getChargeStatus(externalId: string): Promise<ChargeResponse>
    cancelCharge(externalId: string): Promise<boolean>
    refundCharge(externalId: string): Promise<boolean>
}
