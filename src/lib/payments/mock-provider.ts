import { PaymentProviderInterface, CreateChargePayload, ChargeResponse } from './types'

export class MockPaymentProvider implements PaymentProviderInterface {
    async createCharge(payload: CreateChargePayload): Promise<ChargeResponse> {
        console.log('Mock: Creating charge for', payload.client.name)

        // Simular um atraso
        await new Promise(resolve => setTimeout(resolve, 500))

        const externalId = `mock_${Math.random().toString(36).substr(2, 9)}`

        if (payload.paymentMethod === 'BOLETO') {
            return {
                externalId,
                status: 'PENDING',
                barcode: '12345678901234567890123456789012345678901234',
                linhaDigitavel: '12345.67890 12345.678901 23456.789012 3 45678901234567',
                paymentUrl: `https://mock-bank.com/boleto/${externalId}`
            }
        }

        return {
            externalId,
            status: 'PAID', // Cartão mock sempre aprova
            paymentUrl: `https://mock-bank.com/receipt/${externalId}`
        }
    }

    async getChargeStatus(externalId: string): Promise<ChargeResponse> {
        return {
            externalId,
            status: 'PAID'
        }
    }

    async cancelCharge(externalId: string): Promise<boolean> {
        console.log('Mock: Cancelling charge', externalId)
        return true
    }

    async refundCharge(externalId: string): Promise<boolean> {
        console.log('Mock: Refunding charge', externalId)
        return true
    }
}
