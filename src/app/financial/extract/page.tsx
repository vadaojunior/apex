'use client'

import { useState, useEffect } from 'react'
import {
    FileText,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar as CalendarIcon,
    Download,
    Search
} from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
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
import { cn } from '@/lib/utils'

export default function ExtractPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        fetchExtract()
    }, [])

    const fetchExtract = async () => {
        setLoading(true)
        try {
            let url = '/api/financial/extract'
            if (startDate && endDate) {
                url += `?start=${startDate}&end=${endDate}`
            }
            const res = await fetch(url)
            const data = await res.json()
            setTransactions(data)
        } finally {
            setLoading(false)
        }
    }

    const totalIn = transactions
        .filter(t => t.type === 'INCOME' && t.status === 'PAID')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalOut = transactions
        .filter(t => t.type === 'EXPENSE' && t.status === 'PAID')
        .reduce((acc, t) => acc + t.amount, 0)

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37]">Extrato Consolidado</h1>
                    <p className="text-gray-400">Visão unificada de fluxo de caixa e transações.</p>
                </div>
                <Button variant="outline" className="border-yellow-600/20 text-[#d4af37]">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                </Button>
            </header>

            <div className="flex flex-wrap gap-4 items-end bg-[#1a1a1a] p-4 rounded-xl border border-yellow-600/5">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Início</label>
                    <Input
                        type="date"
                        className="bg-[#252525] border-gray-800 text-white w-40"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Fim</label>
                    <Input
                        type="date"
                        className="bg-[#252525] border-gray-800 text-white w-40"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <Button className="bg-[#d4af37] text-black hover:bg-[#b8952e]" onClick={fetchExtract}>
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Entradas (Liquidadas)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-green-500">{formatCurrency(totalIn)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Saídas (Liquidadas)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-red-500">{formatCurrency(totalOut)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Tipo</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-gray-400 text-xs">
                                    {new Date(t.date).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="text-white font-medium max-w-[300px] truncate">
                                    {t.description}
                                </TableCell>
                                <TableCell>
                                    {t.type === 'INCOME' ? (
                                        <span className="flex items-center text-green-500 text-xs font-bold uppercase">
                                            <ArrowUpCircle className="w-3 h-3 mr-1" /> Entrada
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-500 text-xs font-bold uppercase">
                                            <ArrowDownCircle className="w-3 h-3 mr-1" /> Saída
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
                                        t.status === 'PAID' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                    )}>
                                        {t.status === 'PAID' ? 'Liquidado' : 'Pendente'}
                                    </span>
                                </TableCell>
                                <TableCell className={cn(
                                    "text-right font-black",
                                    t.type === 'INCOME' ? "text-green-500" : "text-red-500"
                                )}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-gray-500 italic">
                                    Nenhuma transação encontrada para este período.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
