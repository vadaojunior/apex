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
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
            <div className="max-w-md w-full space-y-8 bg-[#1a1a1a] p-10 rounded-xl border border-yellow-600/20 shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-6">
                        {/* Note: Path will be adjusted after verifying exact location of the logo */}
                        <Image
                            src="/logo.png"
                            alt="APEX Logo"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-[#d4af37]">
                        Acesso Restrito
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        APEX – Assessoria em Armas
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="username" className="sr-only">Usuário</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-800 placeholder-gray-500 text-white bg-[#252525] focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 focus:z-10 sm:text-sm transition-all"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Senha</label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-800 placeholder-gray-500 text-white bg-[#252525] focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 focus:z-10 sm:text-sm transition-all"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-[#d4af37] hover:bg-[#b8952e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Entrando...' : 'Entrar no Painel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
