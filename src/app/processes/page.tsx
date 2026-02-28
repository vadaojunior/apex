'use client'

import { useState, useEffect } from 'react'
import {
    Activity,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search
} from 'lucide-react'
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

export default function ProcessesPage() {
    const [processes, setProcesses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProcesses()
    }, [])

    const fetchProcesses = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/processes')
            const result = await res.json()
            if (Array.isArray(result)) {
                setProcesses(result)
            }
        } catch (err) {
            console.error('Erro ao buscar processos:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/processes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                fetchProcesses()
            } else {
                alert('Erro ao atualizar status do processo')
            }
        } catch (err) {
            alert('Erro na requisição')
        }
    }

    const filteredProcesses = processes.filter(p => {
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
        const matchesSearch = p.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.service.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'CONCLUIDO':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Concluído</span>
            case 'PENDING':
            case 'PENDENTE':
            case 'EM_ANDAMENTO':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Em Andamento</span>
            case 'CANCELLED':
            case 'CANCELADO':
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Cancelado</span>
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 w-fit">{status}</span>
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37] flex items-center">
                        <Activity className="w-8 h-8 mr-3" /> Processos em Andamento
                    </h1>
                    <p className="text-gray-400 mt-2">Acompanhe e atualize os status dos serviços vendidos.</p>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1a1a1a] p-4 rounded-lg border border-yellow-600/10 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                        placeholder="Buscar por cliente ou serviço..."
                        className="pl-10 bg-[#252525] border-gray-800 text-white w-full h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-4 w-full md:w-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400 whitespace-nowrap">Status:</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-[#252525] border-gray-800 text-white h-10">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="PENDING">Em Andamento</SelectItem>
                                <SelectItem value="COMPLETED">Concluídos</SelectItem>
                                <SelectItem value="CANCELLED">Cancelados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Data Base</TableHead>
                            <TableHead className="text-gray-400">Cliente</TableHead>
                            <TableHead className="text-gray-400">Serviço/Processo</TableHead>
                            <TableHead className="text-gray-400">Observações</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProcesses.map((p) => (
                            <TableRow key={p.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-gray-400 text-sm">
                                    {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell className="text-white font-medium">{p.client.name}</TableCell>
                                <TableCell className="text-[#d4af37] font-semibold">{p.service.name}</TableCell>
                                <TableCell className="text-gray-400 text-sm truncate max-w-[200px]" title={p.notes}>{p.notes || '-'}</TableCell>
                                <TableCell>{getStatusBadge(p.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Select value={p.status} onValueChange={(val) => handleUpdateStatus(p.id, val)}>
                                        <SelectTrigger className="w-[130px] ml-auto border-gray-700 bg-transparent text-xs h-8 text-white">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                            <SelectItem value="PENDING">Em Andamento</SelectItem>
                                            <SelectItem value="COMPLETED">Concluído</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProcesses.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-gray-500 italic">
                                    Nenhum processo encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-[#d4af37] animate-pulse">
                                    Carregando processos...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
