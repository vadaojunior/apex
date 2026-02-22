import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#d4af37]">Dashboard</h1>
                    <p className="text-gray-400 mt-2">Bem-vindo, {session.name || session.username}.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-yellow-600/10 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Clientes Ativos</h3>
                        <p className="text-3xl font-bold mt-2">--</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-yellow-600/10 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Processos em Andamento</h3>
                        <p className="text-3xl font-bold mt-2">--</p>
                    </div>
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-yellow-600/10 shadow-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Serviços Disponíveis</h3>
                        <p className="text-3xl font-bold mt-2">6</p>
                    </div>
                </div>

                <div className="mt-10 bg-[#1a1a1a] p-8 rounded-xl border border-yellow-600/10 h-64 flex items-center justify-center">
                    <p className="text-gray-500 italic">Estrutura base pronta. Implementação de CRUDs em andamento...</p>
                </div>
            </div>
        </div>
    )
}
