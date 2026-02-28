'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Briefcase,
    ShoppingCart,
    ArrowUpCircle,
    ArrowDownCircle,
    Settings,
    LogOut,
    Receipt,
    BarChart3,
    Shield,
    Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Atendimentos', href: '/sales', icon: ShoppingCart },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Serviços', href: '/services', icon: Briefcase },
    { name: 'Contas a Receber', href: '/receivables', icon: ArrowUpCircle },
    { name: 'Contas a Pagar', href: '/payables', icon: ArrowDownCircle },
    { name: 'Processos', href: '/processes', icon: Activity },
    { name: 'Extrato', href: '/financial/extract', icon: Receipt },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Audit Logs', href: '/settings/audit-logs', icon: Shield },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-[#0a0c10]/95 backdrop-blur-xl border-r border-[#d4af37]/10 min-h-screen flex flex-col relative z-20">
            {/* Top Branding */}
            <div className="p-8 relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"></div>
                <h2 className="text-[#d4af37] font-black text-2xl tracking-[0.15em] italic italic-black">APEX</h2>
                <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,1)]"></div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tactical Center</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-xs font-black uppercase tracking-widest border border-transparent",
                                isActive
                                    ? "bg-[#d4af37] text-black shadow-[0_5px_15px_-5px_rgba(212,175,55,0.4)] border-[#d4af37]"
                                    : "text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/5"
                            )}
                        >
                            <item.icon className={cn(
                                "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-black" : "text-[#d4af37]/60 group-hover:text-[#d4af37]"
                            )} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 mt-auto mb-4">
                <div className="bg-[#1a1d23] border border-white/5 rounded-2xl p-1">
                    <button
                        className="flex items-center justify-center space-x-3 px-4 py-4 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
                        onClick={() => {
                            window.location.href = '/login'
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Encerrar Operação</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-4 left-6 pointer-events-none opacity-10">
                <p className="text-[8px] font-mono text-gray-500">APEX.AUTH.v2.0-SECURED</p>
            </div>
        </aside>
    )
}
