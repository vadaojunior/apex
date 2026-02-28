'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    CheckCircle2,
    AlertCircle,
    Clock,
    DollarSign,
    MoreVertical,
    ChevronDown,
    Trash2,
    Link as LinkIcon
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ReceivablesPage() {
    const [receivables, setReceivables] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        fetchReceivables()
    }, [statusFilter])

    const fetchReceivables = async () => {
        setLoading(true)
        try {
            const url = statusFilter === 'ALL' ? '/api/receivables' : `/api/receivables?status=${statusFilter}`
            const res = await fetch(url)
            const result = await res.json()
            if (result && Array.isArray(result.receivables)) {
                setReceivables(result.receivables)
            } else if (Array.isArray(result)) {
                // Fallback in case the API changes back to returning a flat array
                setReceivables(result)
            } else {
                setReceivables([])
                console.error('Formato de resposta inesperado:', result)
            }
        } catch (err) {
            console.error('Erro ao buscar contas a receber:', err)
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async (id: string, amount: number) => {
        try {
            const res = await fetch('/api/receivables', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, receivedAmount: amount })
            })
            if (res.ok) {
                fetchReceivables()
            }
        } catch (err) {
            alert('Erro ao registrar pagamento')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta conta a receber?')) return
        try {
            const res = await fetch(`/api/receivables?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchReceivables()
            } else {
                alert('Erro ao excluir conta a receber')
            }
        } catch (err) {
            alert('Erro na requisição')
        }
    }

    const handleGeneratePaymentLink = async (id: string) => {
        try {
            setLoading(true)
            const res = await fetch('/api/payments/mercadopago/preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receivableId: id })
            })

            const result = await res.json()
            if (res.ok && result?.init_point) {
                // Open the MP checkout in a new window/tab
                window.open(result.init_point, '_blank')
            } else {
                alert(`Erro ao gerar link: ${result?.error || 'Desconhecido'}`)
            }
        } catch (error) {
            alert('Erro na comunicação com o servidor Mercado Pago')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Pago</span>
            case 'OVERDUE':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Vencido</span>
            case 'OPEN':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Aberto</span>
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-500 w-fit">{status}</span>
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37]">Contas a Receber</h1>
                    <p className="text-gray-400">Gerencie recebimentos de vendas e atendimentos.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold px-1">Filtrar Status</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="OPEN">Aberto</SelectItem>
                                <SelectItem value="PAID">Pago</SelectItem>
                                <SelectItem value="OVERDUE">Vencido</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Aberto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {formatCurrency(receivables.filter(r => r.status === 'OPEN').reduce((acc, r) => acc + (r.amount - r.receivedAmount), 0))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Recebido (Mês)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {formatCurrency(receivables.filter(r => r.status === 'PAID').reduce((acc, r) => acc + r.receivedAmount, 0))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#1a1a1a] border-yellow-600/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Vencido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {formatCurrency(receivables.filter(r => r.status === 'OVERDUE').reduce((acc, r) => acc + (r.amount - r.receivedAmount), 0))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Vencimento</TableHead>
                            <TableHead className="text-gray-400">Cliente</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Forma</TableHead>
                            <TableHead className="text-gray-400">Valor</TableHead>
                            <TableHead className="text-gray-400">Recebido</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receivables.map((r) => (
                            <TableRow key={r.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-white font-medium">
                                    {new Date(r.dueDate).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="text-gray-300">{r.client.name}</TableCell>
                                <TableCell className="text-gray-400 text-sm truncate max-w-[200px]">{r.description}</TableCell>
                                <TableCell className="text-gray-400 text-xs">
                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300 w-fit">
                                        {r.paymentMethod === 'CASH' ? 'Dinheiro/PIX' :
                                            r.paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' :
                                                r.paymentMethod === 'BOLETO' ? 'Boleto Bancário' : r.paymentMethod}
                                    </span>
                                </TableCell>
                                <TableCell className="text-white font-bold">{formatCurrency(r.amount)}</TableCell>
                                <TableCell className="text-green-500/80 font-medium">{formatCurrency(r.receivedAmount)}</TableCell>
                                <TableCell>{getStatusBadge(r.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {r.status !== 'PAID' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8"
                                                    onClick={() => handleGeneratePaymentLink(r.id)}
                                                    title="Gerar Link Mercado Pago"
                                                >
                                                    <LinkIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                                                    onClick={() => handlePayment(r.id, r.amount - r.receivedAmount)}
                                                >
                                                    Dar Baixa
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                                            onClick={() => handleDelete(r.id)}
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {receivables.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 text-gray-500 italic">
                                    Nenhuma conta encontrada para o filtro selecionado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div >
    )
}
