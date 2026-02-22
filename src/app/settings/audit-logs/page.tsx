'use client'

import { useState, useEffect } from 'react'
import { Shield, Clock, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filterAction, setFilterAction] = useState('ALL')
    const [filterResource, setFilterResource] = useState('ALL')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)

    const fetchLogs = async () => {
        setLoading(true)
        try {
            let url = `/api/audit-logs?page=${page}`
            if (filterAction !== 'ALL') url += `&action=${filterAction}`
            if (filterResource !== 'ALL') url += `&resource=${filterResource}`

            const res = await fetch(url)
            const data = await res.json()
            setLogs(data.logs || [])
            setPagination(data.pagination)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [page, filterAction, filterResource])

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#d4af37] flex items-center">
                        <Shield className="w-8 h-8 mr-3" />
                        Logs de Auditoria
                    </h1>
                    <p className="text-gray-400">Rastreabilidade completa de ações críticas no sistema.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Select onValueChange={(v) => { setFilterAction(v); setPage(1); }}>
                            <SelectTrigger className="w-[150px] bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectValue placeholder="Ação" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectItem value="ALL">Todas Ações</SelectItem>
                                <SelectItem value="LOGIN">Login</SelectItem>
                                <SelectItem value="CREATE">Criação</SelectItem>
                                <SelectItem value="UPDATE">Edição</SelectItem>
                                <SelectItem value="CANCEL">Cancelamento</SelectItem>
                                <SelectItem value="PAYMENT">Pagamento</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(v) => { setFilterResource(v); setPage(1); }}>
                            <SelectTrigger className="w-[150px] bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectValue placeholder="Recurso" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-gray-800 text-white">
                                <SelectItem value="ALL">Todos Recursos</SelectItem>
                                <SelectItem value="CLIENT">Clientes</SelectItem>
                                <SelectItem value="SERVICE">Serviços</SelectItem>
                                <SelectItem value="SALE">Vendas</SelectItem>
                                <SelectItem value="RECEIVABLE">Recebíveis</SelectItem>
                                <SelectItem value="PAYABLE">Pagáveis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Data/Hora</TableHead>
                            <TableHead className="text-gray-400">Recurso</TableHead>
                            <TableHead className="text-gray-400">Ação</TableHead>
                            <TableHead className="text-gray-400">Detalhes</TableHead>
                            <TableHead className="text-gray-400">IP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-gray-800 hover:bg-white/5 transition-all">
                                <TableCell className="text-gray-400 text-xs">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-2" />
                                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-600/10 text-[#d4af37] border border-yellow-600/20 font-bold uppercase">
                                        {log.resource}
                                    </span>
                                </TableCell>
                                <TableCell className="text-white font-medium">
                                    {log.action}
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm italic">{log.details}</TableCell>
                                <TableCell className="text-gray-600 text-[10px]">{log.ip}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {!loading && logs.length === 0 && (
                    <div className="text-center py-20 text-gray-500 italic">
                        Nenhum registro de auditoria encontrado para os filtros selecionados.
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-[#252525]/30">
                        <span className="text-sm text-gray-500">
                            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="border-gray-800 text-gray-400"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="border-gray-800 text-gray-400"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
