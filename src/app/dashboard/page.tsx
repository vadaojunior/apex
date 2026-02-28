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
    ShieldCheck,
    Activity
} from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import { cn } from '@/lib/utils'
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
        <div className="p-8 space-y-10 max-w-7xl mx-auto selection:bg-[#d4af37]/30">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#d4af37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                    <h1 className="text-5xl font-black text-[#d4af37] tracking-tighter italic uppercase italic-black">DASHBOARD</h1>
                    <p className="text-gray-500 uppercase text-[10px] tracking-[0.3em] font-black mt-1 ml-1 opacity-70">Tactical Operations & Financial Intelligence</p>
                </div>
                <div className="flex items-center space-x-3 bg-[#d4af37]/5 px-5 py-2.5 rounded-2xl border border-[#d4af37]/20 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest">System Secured</span>
                    <ShieldCheck className="w-4 h-4 text-[#d4af37] opacity-50" />
                </div>
            </header>

            {/* Alerts Section */}
            {(stats?.overdueCount > 0) && (
                <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex items-center justify-between group animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-md">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-black uppercase tracking-widest">Alerta: {stats.overdueCount} Pendências Críticas</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Total em atraso: <span className="text-red-400">{formatCurrency(stats.overdueAmount + (stats.overduePayablesAmount || 0))}</span></p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Button asChild size="sm" variant="outline" className="h-10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white uppercase text-[10px] font-black tracking-widest rounded-xl transition-all">
                            <Link href="/receivables">Liquidar Recebíveis</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Receita Operacional', value: stats?.revenue, sub: `Expectativa: ${formatCurrency(stats?.revenueToReceive || 0)}`, icon: TrendingUp, color: 'text-green-500', isBrass: false },
                    { title: 'Despesas Totais', value: stats?.expenses, sub: 'Logística e Custos Fixos', icon: TrendingDown, color: 'text-red-500', isBrass: false },
                    { title: 'Lucro Estimado', value: stats?.profit, sub: 'Performance Líquida', icon: DollarSign, color: 'text-[#d4af37]', isBrass: true },
                    { title: 'Inadimplência', value: stats?.overdueAmount, sub: 'Valores em Atraso', icon: AlertTriangle, color: 'text-red-500', isBrass: false, isAlert: true }
                ].map((kpi, i) => (
                    <Card key={i} className={cn(
                        "glass-card border-white/5 hover:border-[#d4af37]/30 transition-all duration-500 group relative overflow-hidden",
                        kpi.isAlert && "bg-red-500/5 border-red-500/10 hover:border-red-500/30"
                    )}>
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <kpi.icon className="w-16 h-16" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{kpi.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={cn(
                                "text-3xl font-black tracking-tighter",
                                kpi.isBrass ? "brass-text" : "text-white",
                                kpi.isAlert && "text-red-500"
                            )}>{formatCurrency(kpi.value || 0)}</div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-2 opacity-60 underline decoration-[#d4af37]/20 underline-offset-4">{kpi.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Operations */}
                <div className="lg:col-span-2">
                    <Card className="glass-card border-white/5 tactical-border min-h-[400px]">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white text-xs font-black uppercase tracking-[0.3em]">Monitor de Vencimentos</CardTitle>
                                <div className="text-[9px] bg-[#d4af37]/10 text-[#d4af37] px-2 py-1 rounded font-black tracking-widest uppercase">Live Intelligence</div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="space-y-4">
                                {stats?.nextVencimentos?.map((v: any) => (
                                    <div key={v.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#0f1115] border border-white/5 group hover:border-[#d4af37]/40 transition-all duration-300">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/5 flex items-center justify-center text-[#d4af37] border border-[#d4af37]/10 group-hover:bg-[#d4af37]/10 transition-colors">
                                                <CalendarIcon className="w-5 h-5 shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase tracking-wider text-sm">{v.client?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{v.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-lg tracking-tight italic">{formatCurrency(v.amount)}</p>
                                            <div className="flex items-center justify-end space-x-2 mt-1">
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">DATA LIMITE:</span>
                                                <span className="text-[10px] text-[#d4af37] font-black">{new Date(v.dueDate).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {stats?.nextVencimentos?.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-30">
                                        <ShieldCheck className="w-12 h-12 text-[#d4af37]" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Nenhum vencimento detectado no radar</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-10 pt-4 border-t border-white/5">
                                <Button asChild variant="link" className="text-[#d4af37] p-0 h-auto font-black uppercase text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity">
                                    <Link href="/receivables" className="flex items-center">
                                        Explorar Relatório Completo <ArrowRight className="w-4 h-4 ml-2 animate-bounce-x" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Panel */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4">
                        <Button asChild className="h-20 bg-[#d4af37] text-black font-black hover:bg-[#eec643] uppercase tracking-[.15em] italic rounded-2xl shadow-[0_15px_30px_-10px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1">
                            <Link href="/sales">
                                <div className="flex items-center justify-between w-full px-6">
                                    <div className="text-left">
                                        <span className="block text-[9px] opacity-60">Operação de</span>
                                        <span className="text-xl leading-none">Venda</span>
                                    </div>
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-20 border-[#d4af37]/20 text-[#d4af37] glass-card font-black hover:bg-[#d4af37]/5 uppercase tracking-[.15em] italic rounded-2xl transition-all hover:-translate-y-1">
                            <Link href="/clients">
                                <div className="flex items-center justify-between w-full px-6">
                                    <div className="text-left">
                                        <span className="block text-[9px] opacity-60">Cadastrar</span>
                                        <span className="text-xl leading-none">Cliente</span>
                                    </div>
                                    <Users className="w-8 h-8" />
                                </div>
                            </Link>
                        </Button>
                    </div>

                    <Card className="glass-card border-white/5 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
                        <CardHeader>
                            <CardTitle className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Deployment Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: 'Clientes Base', val: stats?.clientsCount, icon: Users },
                                { label: 'Em Processamento', val: stats?.activeProcesses, icon: Activity },
                                { label: 'Catálogo de Serviços', val: stats?.totalServices, icon: Briefcase }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center space-x-3">
                                        <stat.icon className="w-3.5 h-3.5 text-[#d4af37] opacity-60" />
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                                    </div>
                                    <span className="text-white font-black text-sm tabular-nums">{stat.val || 0}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShieldCheck className="w-20 h-20" />
                        </div>
                        <h3 className="text-white text-xs font-black uppercase tracking-widest">Suporte Tático</h3>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Canal Direto de Assessoria</p>
                        <Button className="mt-4 w-full bg-white/5 hover:bg-white/10 text-[#d4af37] border border-[#d4af37]/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Abrir chamado</Button>
                    </div>
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
