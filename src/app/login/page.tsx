'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/dashboard')
            } else {
                setError(data.message || 'Erro ao realizar login')
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] px-4 selection:bg-[#d4af37]/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl border border-[#d4af37]/10 shadow-2xl relative z-10 transition-all hover:border-[#d4af37]/20">
                <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-8 p-4 bg-gradient-to-b from-[#d4af37]/10 to-transparent rounded-full border border-[#d4af37]/20 shadow-[0_0_30px_-10px_rgba(212,175,55,0.3)]">
                        <Image
                            src="/logo.png"
                            alt="APEX Logo"
                            fill
                            sizes="160px"
                            className="object-contain p-6"
                            priority
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter uppercase brass-text italic">
                            Acesso Restrito
                        </h2>
                        <div className="h-[2px] w-12 bg-[#d4af37] mx-auto rounded-full"></div>
                        <p className="mt-4 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                            APEX – Assessoria em Armas
                        </p>
                    </div>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60 ml-1">Identificação</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/5 placeholder-gray-600 text-white bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37]/40 transition-all text-sm"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60 ml-1">Código de Segurança</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-white/5 placeholder-gray-600 text-white bg-[#0f1115] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37]/40 transition-all text-sm"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-bold text-center bg-red-500/10 border border-red-500/20 py-3 rounded-lg animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-[#d4af37]/30 text-xs font-black uppercase tracking-[0.2em] rounded-xl text-black bg-[#d4af37] hover:bg-[#eec643] hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_-10px_rgba(212,175,55,0.4)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center space-x-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                    <span>Verificando...</span>
                                </span>
                            ) : (
                                'Entrar no Painel'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-4">
                    <p className="text-[9px] text-gray-600 font-medium uppercase tracking-widest">
                        Sistema APEX v2.0 - Tactical Operations
                    </p>
                </div>
            </div>
        </div>
    )
}
