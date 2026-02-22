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
} from "@/components/ui/dialog"

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // New Service Form
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('0')

    useEffect(() => {
        fetchServices()
    }, [])

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
                body: JSON.stringify({ name, description, price: numericPrice })
            })
            if (res.ok) {
                setOpen(false)
                fetchServices()
                setName(''); setDescription(''); setPrice('0')
            }
        } catch (err) {
            alert('Erro ao criar serviço')
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
                            <Button type="submit" className="w-full bg-[#d4af37] text-black hover:bg-[#b8952e]">Salvar Serviço</Button>
                        </form>
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
                                    <Button size="icon" variant="ghost" className="text-gray-400 hover:bg-white/5">
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
