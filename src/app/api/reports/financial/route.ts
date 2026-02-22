import { ApiResponse } from '@/lib/api-response'
import { ReportService } from '@/services/ReportService'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) return ApiResponse.unauthorized()

        const { searchParams } = new URL(request.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        const startDate = start ? new Date(start) : undefined
        const endDate = end ? new Date(end) : undefined

        const summary = await ReportService.getFinancialSummary(startDate, endDate)
        const revenueByService = await ReportService.getRevenueByService()

        return ApiResponse.success({
            summary,
            revenueByService
        })
    } catch (error) {
        console.error('Report API Error:', error)
        return ApiResponse.serverError('Erro ao gerar relatório')
    }
}
