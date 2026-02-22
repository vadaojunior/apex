'use client'

import { useState, useEffect } from 'react'
import {
    Users,
    Briefcase,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertTriangle,
    ArrowRight,
    ShieldCheck
} from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard/stats')
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error('Erro ao buscar stats:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div className="p-8 text-[#d4af37] animate-pulse">Carregando métricas APEX...</div>

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-[#d4af37] tracking-tighter">DASHBOARD</h1>
                    <p className="text-gray-500 uppercase text-xs tracking-[0.2em] font-bold">Resumo Geral - Assessoria em Armas</p>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-600/5 px-4 py-2 rounded-full border border-yellow-600/10">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs text-gray-400 font-medium">Sistema Seguro</span>
                </div>
            </header>
            {/* Alerts Section */}
            {(stats?.overdueCount > 0) && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center justify-between group animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                        <div>
                            <p className="text-white font-bold">Atenção: Existem {stats.overdueCount} itens vencidos!</p>
                            <p className="text-xs text-gray-400">Total em atraso: {formatCurrency(stats.overdueAmount + (stats.overduePayablesAmount || 0))}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button asChild size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                            <Link href="/receivables">Resolver Recebíveis</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                            <Link href="/payables">Resolver Pagáveis</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#111111] border-yellow-600/10 hover:border-yellow-600/30 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Receita (Mês)</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{formatCurrency(stats?.revenue || 0)}</div>
                        <p className="text-xs text-gray-500 mt-1">A receber: {formatCurrency(stats?.revenueToReceive || 0)}</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#111111] border-yellow-600/10 hover:border-yellow-600/30 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Despesas (Mês)</CardTitle>
                        <TrendingDown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{formatCurrency(stats?.expenses || 0)}</div>
                        <p className="text-xs text-gray-500 mt-1">Total faturado no período</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#111111] border-yellow-600/10 hover:border-yellow-600/30 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Lucro Estimado</CardTitle>
                        <DollarSign className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-[#d4af37]">{formatCurrency(stats?.profit || 0)}</div>
                        <p className="text-xs text-gray-500 mt-1">Resultado líquido mensal</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#111111] border-red-900/20 hover:border-red-500/30 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Inadimplência</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-500">{formatCurrency(stats?.overdueAmount || 0)}</div>
                        <p className="text-xs text-gray-500 mt-1">Total de valores vencidos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Operations */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#111111] border-yellow-600/10">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Próximos Vencimentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.nextVencimentos?.map((v: any) => (
                                    <div key={v.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 group hover:border-[#d4af37]/20 transition-all">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-yellow-600/10 flex items-center justify-center text-[#d4af37]">
                                                <CalendarIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{v.client?.name}</p>
                                                <p className="text-xs text-gray-500">{v.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black">{formatCurrency(v.amount)}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">{new Date(v.dueDate).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                ))}
                                {stats?.nextVencimentos?.length === 0 && (
                                    <p className="text-center py-8 text-gray-500 italic">Nenhum vencimento próximo.</p>
                                )}
                            </div>
                            <Button asChild variant="link" className="text-[#d4af37] mt-4 p-0 h-auto font-bold uppercase text-[10px] tracking-widest">
                                <Link href="/receivables" className="flex items-center">
                                    Ver todas as contas <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <Button asChild className="h-16 bg-[#d4af37] text-black font-black hover:bg-[#b8952e] uppercase tracking-tighter shadow-lg shadow-yellow-600/10">
                            <Link href="/sales">
                                <div className="flex items-center justify-between w-full px-4">
                                    <span className="text-lg">Novo Atendimento</span>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-16 border-yellow-600/20 text-[#d4af37] font-black hover:bg-yellow-600/5 uppercase tracking-tighter">
                            <Link href="/clients">
                                <div className="flex items-center justify-between w-full px-4">
                                    <span className="text-lg">Cadastrar Cliente</span>
                                    <Users className="w-6 h-6" />
                                </div>
                            </Link>
                        </Button>
                    </div>

                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-yellow-600/20">
                        <CardHeader>
                            <CardTitle className="text-white text-sm uppercase tracking-widest text-[#d4af37]">Status Operacional</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-xs">Total de Clientes</span>
                                <span className="text-white font-bold">{stats?.clientsCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-xs">Processos Ativos</span>
                                <span className="text-white font-bold">{stats?.activeProcesses || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-xs">Serviços Disponíveis</span>
                                <span className="text-white font-bold">{stats?.totalServices || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function CalendarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}
