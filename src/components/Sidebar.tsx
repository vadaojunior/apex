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
    Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Atendimentos', href: '/sales', icon: ShoppingCart },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Serviços', href: '/services', icon: Briefcase },
    { name: 'Contas a Receber', href: '/receivables', icon: ArrowUpCircle },
    { name: 'Contas a Pagar', href: '/payables', icon: ArrowDownCircle },
    { name: 'Extrato', href: '/financial/extract', icon: Receipt },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Audit Logs', href: '/settings/audit-logs', icon: Shield },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-[#1a1a1a] border-r border-yellow-600/10 min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-[#d4af37] font-bold text-xl tracking-wider">APEX</h2>
                <p className="text-xs text-gray-500 uppercase mt-1">Assessoria em Armas</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                            pathname === item.href
                                ? "bg-[#d4af37] text-black"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-yellow-600/10">
                <button
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-500/10 transition-all text-sm font-medium"
                    onClick={() => {
                        // Logout logic will be added
                        window.location.href = '/login'
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    )
}
