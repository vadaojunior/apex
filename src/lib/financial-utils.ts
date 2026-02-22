/**
 * Financial utilities for APEX - Assessoria em Armas
 * Values are stored in cents (Integer)
 */

export const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(cents / 100)
}

export const toCents = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
    return Math.round(numericValue * 100)
}

export interface CardCalculation {
    totalAmount: number
    installments: number
    taxPercent: number
    taxFixed: number
}

export const calculateCardNetValue = (params: CardCalculation) => {
    const { totalAmount, installments, taxPercent, taxFixed } = params

    const percentTaxAmount = Math.round(totalAmount * (taxPercent / 100))
    const fixedTaxAmount = taxFixed // already in cents

    const totalTaxes = percentTaxAmount + fixedTaxAmount
    const netAmount = totalAmount - totalTaxes
    const installmentValue = Math.floor(totalAmount / installments)

    return {
        totalAmount,
        totalTaxes,
        netAmount,
        installmentValue,
    }
}
