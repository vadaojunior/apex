'use client'

import { useState, useEffect } from 'react'
import { Shield, Clock, User, Activity } from 'lucide-react'
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

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await fetch('/api/audit-logs')
                const data = await res.json()
                setLogs(data)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-[#d4af37] flex items-center">
                    <Shield className="w-8 h-8 mr-3" />
                    Logs de Auditoria
                </h1>
                <p className="text-gray-400">Rastreabilidade completa de ações críticas no sistema.</p>
            </header>

            <Card className="bg-[#1a1a1a] border-yellow-600/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#252525]">
                        <TableRow className="border-gray-800">
                            <TableHead className="text-gray-400">Data/Hora</TableHead>
                            <TableHead className="text-gray-400">Recurso</TableHead>
                            <TableHead className="text-gray-400">Ação</TableHead>
                            <TableHead className="text-gray-400">Detalhes</TableHead>
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
                            </TableRow>
                        ))}
                        {logs.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-gray-500 italic">
                                    Nenhum registro de auditoria encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
