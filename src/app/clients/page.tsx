'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, MessageCircle, UserPlus, Phone, Mail, FileText } from 'lucide-react'
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // New Client Form
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/clients')
            const data = await res.json()
            setClients(data)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, cpf, phone, email })
            })
            if (res.ok) {
                setOpen(false)
                fetchClients()
                setName(''); setCpf(''); setPhone(''); setEmail('')
            }
        } catch (err) {
            alert('Erro ao criar cliente')
        }
    }

    const openWhatsApp = (phoneNumber: string) => {
        const cleanNumber = phoneNumber.replace(/\D/g, '')
        // Ensure 55 prefix for Brazil if not present
        const formatted = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`
        window.open(`https://wa.me/${formatted}`, '_blank')
    }

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.cpf?.includes(search)
    )

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37]">Clientes</h1>
                    <p className="text-gray-400">Gerencie a base de clientes e abra contatos diretos.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#d4af37] text-black hover:bg-[#b8952e]">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#d4af37]">Cadastrar Cliente</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#252525] border-gray-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CPF</Label>
                                    <Input value={cpf} onChange={e => setCpf(e.target.value)} className="bg-[#252525] border-gray-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefone (DDD + Número)</Label>
                                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="16999999999" className="bg-[#252525] border-gray-800" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-[#252525] border-gray-800" />
                            </div>
                            <Button type="submit" className="w-full bg-[#d4af37] text-black hover:bg-[#b8952e]">Salvar Cliente</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Buscar por nome ou CPF..."
                    className="pl-10 bg-[#1a1a1a] border-gray-800 text-white w-full max-w-md"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Nome</TableHead>
                            <TableHead className="text-gray-400">CPF</TableHead>
                            <TableHead className="text-gray-400">Contato</TableHead>
                            <TableHead className="text-gray-400">Cadastro</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-white font-medium">{client.name}</TableCell>
                                <TableCell className="text-gray-400">{client.cpf || '---'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-gray-300 flex items-center text-xs"><Phone className="w-3 h-3 mr-1" /> {client.phone || '---'}</span>
                                        <span className="text-gray-500 flex items-center text-[10px]"><Mail className="w-3 h-3 mr-1" /> {client.email || '---'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 text-xs">
                                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {client.phone && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-green-500 hover:bg-green-500/10"
                                            onClick={() => openWhatsApp(client.phone)}
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="text-gray-400 hover:bg-white/5">
                                        <FileText className="w-5 h-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
