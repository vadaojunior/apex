'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, Tag, CreditCard, RefreshCw, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
    'Aluguel',
    'Energia/Água',
    'Internet',
    'Sistemas/Software',
    'Marketing',
    'Impostos',
    'Salários/Comissões',
    'Material de Escritório',
    'Outros'
]

export default function PayablesPage() {
    const [payables, setPayables] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // New Payable Form
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState('0')
    const [dueDate, setDueDate] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)

    useEffect(() => {
        fetchPayables()
    }, [])

    const fetchPayables = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/payables')
            const data = await res.json()
            setPayables(data)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const numericAmount = Math.round(parseFloat(amount.replace(',', '.')) * 100)
            const res = await fetch('/api/payables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    category,
                    amount: numericAmount,
                    dueDate,
                    isRecurring,
                    recurrenceInterval: isRecurring ? 'MONTHLY' : null
                })
            })
            if (res.ok) {
                setOpen(false)
                fetchPayables()
                setDescription(''); setCategory(''); setAmount('0'); setDueDate(''); setIsRecurring(false)
            }
        } catch (err) {
            alert('Erro ao criar conta a pagar')
        }
    }

    const handleStatusChange = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'PAID' ? 'OPEN' : 'PAID'
        try {
            const res = await fetch('/api/payables', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                fetchPayables()
            }
        } catch (err) {
            alert('Erro ao atualizar status')
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37]">Contas a Pagar</h1>
                    <p className="text-gray-400">Controle suas despesas fixas e variáveis.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-500 text-white hover:bg-red-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Despesa
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-red-500">Cadastrar Despesa</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Input value={description} onChange={e => setDescription(e.target.value)} required className="bg-[#252525] border-gray-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select onValueChange={setCategory} required>
                                        <SelectTrigger className="bg-[#252525] border-gray-800">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Vencimento</Label>
                                    <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="bg-[#252525] border-gray-800" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Valor (R$)</Label>
                                <Input
                                    type="text"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="bg-[#252525] border-gray-800"
                                    placeholder="0,00"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is-recurring"
                                    className="rounded border-gray-800 bg-[#252525] text-red-500"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                />
                                <Label htmlFor="is-recurring" className="text-sm text-gray-400">Despesa Recorrente (Mensal)</Label>
                            </div>
                            <Button type="submit" className="w-full bg-red-500 text-white hover:bg-red-600">Salvar Despesa</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Vencimento</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Categoria</TableHead>
                            <TableHead className="text-gray-400">Valor</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payables.map((p) => {
                            const isOverdue = new Date(p.dueDate) < new Date() && p.status !== 'PAID'
                            return (
                                <TableRow key={p.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                    <TableCell className="text-white font-medium">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                                            {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                                            {isOverdue && <AlertCircle className="w-3 h-3 ml-2 text-red-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        <div className="flex items-center">
                                            {p.isRecurring && <RefreshCw className="w-3 h-3 mr-2 text-blue-500" />}
                                            {p.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-800 text-gray-400 border border-gray-700">
                                            {p.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-white font-bold">{formatCurrency(p.amount)}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-bold",
                                            p.status === 'PAID' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        )}>
                                            {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={p.status === 'PAID' ? "text-gray-500" : "text-green-500 hover:bg-green-500/10"}
                                            onClick={() => handleStatusChange(p.id, p.status)}
                                        >
                                            {p.status === 'PAID' ? 'Estornar' : 'Pagar'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {payables.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-gray-500 italic">
                                    Nenhuma conta a pagar registrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
