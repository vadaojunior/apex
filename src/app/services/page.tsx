'use client'

import { useState, useEffect } from 'react'
import { Plus, Briefcase, Tag, Trash2, Edit } from 'lucide-react'
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
    DialogDescription,
} from "@/components/ui/dialog"

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('0')
    const [templates, setTemplates] = useState<any[]>([])
    const [expenseCategories, setExpenseCategories] = useState<any[]>([])

    // Edit Service Form
    const [editService, setEditService] = useState<any>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editTemplates, setEditTemplates] = useState<any[]>([])

    useEffect(() => {
        fetchServices()
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/expense-categories')
            const result = await res.json()
            if (result && Array.isArray(result.data)) {
                setExpenseCategories(result.data)
            } else if (Array.isArray(result)) {
                setExpenseCategories(result)
            }
        } catch (err) {
            console.error('Erro ao buscar categorias:', err)
        }
    }

    const fetchServices = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/services')
            const data = await res.json()
            setServices(data)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const numericPrice = Math.round(parseFloat(price.replace(',', '.')) * 100)
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price: numericPrice,
                    expenseTemplates: templates.map(t => ({
                        description: t.description,
                        categoryId: t.categoryId,
                        amount: Math.round(parseFloat(t.amount.replace(',', '.')) * 100)
                    }))
                })
            })
            if (res.ok) {
                setOpen(false)
                fetchServices()
                setName(''); setDescription(''); setPrice('0'); setTemplates([])
            } else {
                const errorData = await res.json()
                alert(`Erro ao criar serviço: ${errorData.message || 'Erro desconhecido'}`)
            }
        } catch (err: any) {
            alert(`Erro ao criar serviço: ${err.message}`)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editService) return
        try {
            const numericPrice = typeof editService.price === 'string'
                ? Math.round(parseFloat(editService.price.replace(',', '.')) * 100)
                : editService.price

            const res = await fetch('/api/services', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editService.id,
                    name: editService.name,
                    description: editService.description,
                    price: numericPrice,
                    expenseTemplates: editTemplates.map(t => ({
                        description: t.description,
                        categoryId: t.categoryId,
                        amount: typeof t.amount === 'string'
                            ? Math.round(parseFloat(t.amount.replace(',', '.')) * 100)
                            : t.amount
                    }))
                })
            })
            if (res.ok) {
                setOpenEdit(false)
                setEditService(null)
                setEditTemplates([])
                fetchServices()
            } else {
                const errorData = await res.json()
                alert(`Erro ao atualizar serviço: ${errorData.message || 'Erro desconhecido'}`)
            }
        } catch (err: any) {
            alert(`Erro ao atualizar serviço: ${err.message}`)
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37]">Serviços</h1>
                    <p className="text-gray-400">Configure os serviços prestados e seus valores base.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#d4af37] text-black hover:bg-[#b8952e]">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Serviço
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#d4af37]">Cadastrar Serviço</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Preencha os detalhes para adicionar um novo serviço ao sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Nome do Serviço</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#252525] border-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-[#252525] border-gray-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Preço Base (R$)</Label>
                                <Input
                                    type="text"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="bg-[#252525] border-gray-800"
                                    placeholder="0,00"
                                />
                            </div>

                            {/* Expense Templates Section - Create */}
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[#d4af37]">Despesas Obrigatórias Associadas</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-800 text-gray-300 hover:bg-white/5"
                                        onClick={() => setTemplates([...templates, { description: '', categoryId: '', amount: '0' }])}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add
                                    </Button>
                                </div>
                                {templates.map((tpl, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-[#1a1a1a] p-3 rounded border border-gray-800">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Ex: Laudo Psicólogo"
                                                value={tpl.description}
                                                onChange={(e) => {
                                                    const newTpls = [...templates]; newTpls[idx].description = e.target.value; setTemplates(newTpls);
                                                }}
                                                className="bg-[#252525] border-gray-800 h-8 text-sm"
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    className="flex h-8 w-full items-center justify-between rounded-md border border-gray-800 bg-[#252525] px-3 py-1 text-sm text-white focus:outline-none"
                                                    value={tpl.categoryId}
                                                    onChange={(e) => {
                                                        const newTpls = [...templates]; newTpls[idx].categoryId = e.target.value; setTemplates(newTpls);
                                                    }}
                                                    required
                                                >
                                                    <option value="" disabled>Categoria</option>
                                                    {expenseCategories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <Input
                                                    placeholder="Valor (R$)"
                                                    value={tpl.amount}
                                                    onChange={(e) => {
                                                        const newTpls = [...templates]; newTpls[idx].amount = e.target.value; setTemplates(newTpls);
                                                    }}
                                                    className="bg-[#252525] border-gray-800 w-24 h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                                            onClick={() => setTemplates(templates.filter((_, i) => i !== idx))}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {templates.length === 0 && (
                                    <p className="text-xs text-gray-500 italic">Nenhuma despesa obrigatória vinculada. (Opcional)</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full bg-[#d4af37] text-black hover:bg-[#b8952e]">Salvar Serviço</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#d4af37]">Editar Serviço</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Modifique os detalhes do serviço selecionado.
                            </DialogDescription>
                        </DialogHeader>
                        {editService && (
                            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Nome do Serviço</Label>
                                    <Input value={editService.name || ''} onChange={e => setEditService({ ...editService, name: e.target.value })} required className="bg-[#252525] border-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    <Input value={editService.description || ''} onChange={e => setEditService({ ...editService, description: e.target.value })} className="bg-[#252525] border-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Preço Base (R$)</Label>
                                    <Input
                                        type="text"
                                        value={typeof editService.price === 'number' ? (editService.price / 100).toFixed(2).replace('.', ',') : (editService.price || '')}
                                        onChange={e => setEditService({ ...editService, price: e.target.value })}
                                        className="bg-[#252525] border-gray-800"
                                        placeholder="0,00"
                                    />
                                </div>

                                {/* Expense Templates Section - Edit */}
                                <div className="space-y-4 pt-4 border-t border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[#d4af37]">Despesas Obrigatórias Associadas</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-800 text-gray-300 hover:bg-white/5"
                                            onClick={() => setEditTemplates([...editTemplates, { description: '', categoryId: '', amount: '0' }])}
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> Add
                                        </Button>
                                    </div>
                                    {editTemplates.map((tpl, idx) => (
                                        <div key={idx} className="flex gap-2 items-start bg-[#1a1a1a] p-3 rounded border border-gray-800">
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    placeholder="Ex: Laudo Psicólogo"
                                                    value={tpl.description}
                                                    onChange={(e) => {
                                                        const newTpls = [...editTemplates]; newTpls[idx].description = e.target.value; setEditTemplates(newTpls);
                                                    }}
                                                    className="bg-[#252525] border-gray-800 h-8 text-sm"
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex h-8 w-full items-center justify-between rounded-md border border-gray-800 bg-[#252525] px-3 py-1 text-sm text-white focus:outline-none"
                                                        value={tpl.categoryId}
                                                        onChange={(e) => {
                                                            const newTpls = [...editTemplates]; newTpls[idx].categoryId = e.target.value; setEditTemplates(newTpls);
                                                        }}
                                                        required
                                                    >
                                                        <option value="" disabled>Categoria</option>
                                                        {expenseCategories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <Input
                                                        placeholder="Valor (R$)"
                                                        value={typeof tpl.amount === 'number' ? (tpl.amount / 100).toFixed(2).replace('.', ',') : tpl.amount}
                                                        onChange={(e) => {
                                                            const newTpls = [...editTemplates]; newTpls[idx].amount = e.target.value; setEditTemplates(newTpls);
                                                        }}
                                                        className="bg-[#252525] border-gray-800 w-24 h-8 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                                                onClick={() => setEditTemplates(editTemplates.filter((_, i) => i !== idx))}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {editTemplates.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">Nenhuma despesa obrigatória vinculada. (Opcional)</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full bg-[#d4af37] text-black hover:bg-[#b8952e]">Atualizar Serviço</Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </header>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Nome</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-gray-400">Valor</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-white font-medium">{service.name}</TableCell>
                                <TableCell className="text-gray-400">{service.description || '---'}</TableCell>
                                <TableCell className="text-[#d4af37] font-bold">
                                    {formatCurrency(service.price || 0)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-gray-400 hover:bg-white/5"
                                        onClick={() => {
                                            setEditService(service)
                                            setEditTemplates(service.expenseTemplates || [])
                                            setOpenEdit(true)
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-500/50 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-gray-500 italic">
                                    Nenhum serviço cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
