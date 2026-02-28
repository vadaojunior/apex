'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, Tag, CreditCard, RefreshCw, AlertCircle, Edit, User } from 'lucide-react'
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

export default function PayablesPage() {
    const [payables, setPayables] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Payable Form
    const [editingPayable, setEditingPayable] = useState<any>(null)
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [clientId, setClientId] = useState('')
    const [amount, setAmount] = useState('0')
    const [dueDate, setDueDate] = useState('')

    // Category Management
    const [manageCategoryOpen, setManageCategoryOpen] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6')

    // For editing an existing category
    const [editingCategory, setEditingCategory] = useState<any>(null)

    useEffect(() => {
        fetchPayables()
        fetchCategories()
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients')
            const result = await res.json()
            if (result && Array.isArray(result.clients)) {
                setClients(result.clients)
            } else if (Array.isArray(result)) {
                setClients(result)
            }
        } catch (err) {
            console.error('Erro ao buscar clientes:', err)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/expense-categories')
            const result = await res.json()
            if (result && Array.isArray(result.data)) {
                setCategories(result.data)
            } else if (Array.isArray(result)) {
                setCategories(result)
            }
        } catch (err) {
            console.error('Erro ao buscar categorias:', err)
        }
    }

    const fetchPayables = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/payables')
            const result = await res.json()
            if (result && Array.isArray(result.payables)) {
                setPayables(result.payables)
            } else if (Array.isArray(result)) {
                setPayables(result)
            } else {
                setPayables([])
                console.error('Formato de resposta inesperado:', result)
            }
        } catch (err) {
            console.error('Erro ao buscar contas a pagar:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const numericAmount = typeof amount === 'string' ? Math.round(parseFloat(amount.replace(',', '.')) * 100) : amount;

            const url = '/api/payables'
            const method = editingPayable ? 'PATCH' : 'POST'
            const body = editingPayable
                ? { id: editingPayable.id, description, categoryId, clientId, amount: numericAmount, dueDate }
                : { description, categoryId, clientId, amount: numericAmount, dueDate }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                setOpen(false)
                fetchPayables()
                resetForm()
            }
        } catch (err) {
            alert('Erro ao salvar conta a pagar')
        }
    }

    const resetForm = () => {
        setEditingPayable(null)
        setDescription('')
        setCategoryId('')
        setClientId('')
        setAmount('0')
        setDueDate('')
    }

    const handleEditClick = (payable: any) => {
        setEditingPayable(payable)
        setDescription(payable.description)
        setCategoryId(payable.categoryId || '')
        setClientId(payable.clientId || '')
        setAmount((payable.amount / 100).toFixed(2).replace('.', ','))
        setDueDate(new Date(payable.dueDate).toISOString().split('T')[0])
        setOpen(true)
    }

    const handleDeletePayable = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta despesa?')) return
        try {
            const res = await fetch(`/api/payables?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchPayables()
            } else {
                alert('Erro ao excluir conta a pagar')
            }
        } catch (err) {
            alert('Erro ao excluir conta a pagar')
        }
    }

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const url = '/api/expense-categories'
            const method = editingCategory ? 'PATCH' : 'POST'
            const body = editingCategory
                ? JSON.stringify({ id: editingCategory.id, name: newCategoryName, color: newCategoryColor })
                : JSON.stringify({ name: newCategoryName, color: newCategoryColor })

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            })

            if (res.ok) {
                fetchCategories()
                setNewCategoryName('')
                setNewCategoryColor('#3b82f6')
                setEditingCategory(null)
            } else {
                const data = await res.json()
                alert(data?.error || 'Erro ao salvar categoria')
            }
        } catch (err) {
            alert('Erro ao salvar categoria')
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta categoria?')) return
        try {
            const res = await fetch(`/api/expense-categories?id=${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchCategories()
            } else {
                const data = await res.json()
                alert(data?.error || 'Erro ao excluir categoria (pode haver contas vinculadas)')
            }
        } catch (err) {
            alert('Erro ao excluir categoria')
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

                <div className="flex space-x-4">
                    <Dialog open={manageCategoryOpen} onOpenChange={setManageCategoryOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-white/5">
                                <Tag className="w-4 h-4 mr-2" />
                                Categorias
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#d4af37]">Gerenciar Categorias</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                                <form onSubmit={handleCreateCategory} className="flex flex-col space-y-3 p-4 bg-[#252525] rounded-lg border border-gray-800">
                                    <h3 className="text-sm font-medium text-gray-300">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            placeholder="Nome da categoria"
                                            required
                                            className="bg-[#1a1a1a] border-gray-800 flex-1"
                                        />
                                        <Input
                                            type="color"
                                            value={newCategoryColor}
                                            onChange={e => setNewCategoryColor(e.target.value)}
                                            className="w-12 h-10 p-1 bg-[#1a1a1a] border-gray-800 rounded cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                            {editingCategory ? 'Atualizar' : 'Adicionar'}
                                        </Button>
                                        {editingCategory && (
                                            <Button type="button" variant="ghost" onClick={() => {
                                                setEditingCategory(null)
                                                setNewCategoryName('')
                                                setNewCategoryColor('#3b82f6')
                                            }}>
                                                Cancelar
                                            </Button>
                                        )}
                                    </div>
                                </form>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex justify-between items-center bg-[#252525] p-3 rounded-lg border border-gray-800">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: cat.color }}></div>
                                                <span className="font-medium text-gray-200">{cat.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:bg-white/5 hover:text-white" onClick={() => {
                                                    setEditingCategory(cat)
                                                    setNewCategoryName(cat.name)
                                                    setNewCategoryColor(cat.color || '#3b82f6')
                                                }}>
                                                    <Tag className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteCategory(cat.id)}>
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-500 text-white hover:bg-red-600" onClick={resetForm}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Despesa
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-red-500">{editingPayable ? 'Editar Despesa' : 'Cadastrar Despesa'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    <Input value={description} onChange={e => setDescription(e.target.value)} required className="bg-[#252525] border-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cliente Vinculado</Label>
                                    <Select value={clientId} onValueChange={setClientId} required>
                                        <SelectTrigger className="bg-[#252525] border-gray-800">
                                            <SelectValue placeholder="Selecione o Cliente" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#252525] border-gray-800 text-white max-h-60 overflow-y-auto">
                                            {clients.map(client => (
                                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Categoria</Label>
                                        <Select onValueChange={setCategoryId} required>
                                            <SelectTrigger className="bg-[#252525] border-gray-800">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                                {categories.map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></div>
                                                            {cat.name}
                                                        </div>
                                                    </SelectItem>
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
                                <Button type="submit" className="w-full bg-red-500 text-white hover:bg-red-600">Salvar Despesa</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Vencimento</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Cliente</TableHead>
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
                                            {p.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-gray-400 truncate max-w-[150px]" title={p.client?.name}>
                                            <User className="w-3 h-3 mr-1 text-gray-500" />
                                            {p.client?.name || 'Sem vínculo'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {p.category ? (
                                            <span
                                                className="px-2 py-0.5 rounded-full text-[10px] text-white border border-gray-700 font-medium"
                                                style={{ backgroundColor: p.category.color + '40' }} // 40 is hex for 25% opacity
                                            >
                                                {p.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">---</span>
                                        )}
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
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-white"
                                                onClick={() => handleEditClick(p)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDeletePayable(p.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={p.status === 'PAID' ? "text-gray-500" : "text-green-500 hover:bg-green-500/10"}
                                                onClick={() => handleStatusChange(p.id, p.status)}
                                            >
                                                {p.status === 'PAID' ? 'Estornar' : 'Pagar'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {payables.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-500 italic">
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
