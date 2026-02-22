'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3,
    Download,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertCircle,
    Calendar
} from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    })

    const fetchReports = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/reports/financial?start=${dateRange.start}&end=${dateRange.end}`)
            const json = await res.json()
            setData(json)
        } catch (error) {
            console.error('Error fetching reports:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [dateRange])

    const exportToCSV = () => {
        if (!data) return

        const headers = ['Descricao', 'Valor']
        const rows = [
            ['Receita Total', formatCurrency(data.summary.revenue)],
            ['Despesas Totais', formatCurrency(data.summary.expenses)],
            ['Lucro Liquido', formatCurrency(data.summary.profit)],
            ['Inadimplencia', formatCurrency(data.summary.overdueAmount)],
            ['Recebiveis em Aberto', formatCurrency(data.summary.openAmount)],
            ['', ''],
            ['SERVICOS', 'FATURAMENTO']
        ]

        data.revenueByService.forEach((item: any) => {
            rows.push([item.serviceName, formatCurrency(item.totalValue)])
        })

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `relatorio_financeiro_${dateRange.start}_${dateRange.end}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (!data && loading) return <div className="p-8 text-[#d4af37]">Carregando relatórios...</div>

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37] flex items-center">
                        <BarChart3 className="w-8 h-8 mr-3" />
                        Relatórios Financeiros
                    </h1>
                    <p className="text-gray-400">Análise de desempenho e saúde financeira da APEX.</p>
                </div>

                <div className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-yellow-600/10">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#d4af37]" />
                        <Input
                            type="date"
                            className="bg-transparent border-none text-white focus:ring-0 text-sm"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <span className="text-gray-600">até</span>
                    <Input
                        type="date"
                        className="bg-transparent border-none text-white focus:ring-0 text-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                        onClick={exportToCSV}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#1a1a1a] border-[#d4af37]/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-12 h-12 text-green-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Receita no Período</CardDescription>
                        <CardTitle className="text-2xl font-bold text-green-500">
                            {formatCurrency(data?.summary.revenue || 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#d4af37]/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown className="w-12 h-12 text-red-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Despesas no Período</CardDescription>
                        <CardTitle className="text-2xl font-bold text-red-500">
                            {formatCurrency(data?.summary.expenses || 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#d4af37]/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-12 h-12 text-[#d4af37]" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Lucro Líquido</CardDescription>
                        <CardTitle className="text-2xl font-bold text-[#d4af37]">
                            {formatCurrency(data?.summary.profit || 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#d4af37]/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-12 h-12 text-orange-500" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription>Inadimplência</CardDescription>
                        <CardTitle className="text-2xl font-bold text-orange-500">
                            {formatCurrency(data?.summary.overdueAmount || 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue by Service */}
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader>
                        <CardTitle className="text-white text-lg font-medium">Receita por Serviço</CardTitle>
                        <CardDescription>Rank de serviços que mais geraram faturamento.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800">
                                    <TableHead className="text-gray-400">Serviço</TableHead>
                                    <TableHead className="text-gray-400 text-right">Total Faturado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.revenueByService.map((item: any, i: number) => (
                                    <TableRow key={i} className="border-gray-800">
                                        <TableCell className="text-white font-medium">{item.serviceName}</TableCell>
                                        <TableCell className="text-right text-[#d4af37] font-bold">
                                            {formatCurrency(item.totalValue)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Performance Info */}
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader>
                        <CardTitle className="text-white text-lg font-medium">Status de Exportação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-yellow-600/5 border border-yellow-600/20 rounded-lg">
                            <p className="text-gray-400 text-sm italic">
                                Para gerar relatórios em PDF, utilize a função de impressão do navegador (Ctrl + P) enquanto visualiza esta página. A exportação PDF nativa está agendada para a Fase 4.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-300">Resumo de Recebíveis:</p>
                            <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                                <span className="text-gray-400">Total em Aberto (Futuro)</span>
                                <span className="text-white font-bold">{formatCurrency(data?.summary.openAmount || 0)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
