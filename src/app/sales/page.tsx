'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calculator, Receipt, CreditCard, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/financial-utils'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

export default function SalesPage() {
    const [clients, setClients] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Sale Form State
    const [selectedClient, setSelectedClient] = useState('')
    const [saleItems, setSaleItems] = useState<any[]>([])
    const [discount, setDiscount] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('CASH')
    const [installments, setInstallments] = useState(1)
    const [paymentStatus, setPaymentStatus] = useState('PAID')
    const [notes, setNotes] = useState('')

    // Success Modal State
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [generatedReceivableId, setGeneratedReceivableId] = useState<string | null>(null)
    const [mpLink, setMpLink] = useState('')
    const [isGeneratingMP, setIsGeneratingMP] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Log the attempt
                console.log('Iniciando busca de dados em /api/clients e /api/services...')

                const [clientsRes, servicesRes] = await Promise.all([
                    fetch('/api/clients').catch(e => { throw new Error(`Falha ao buscar clientes: ${e.message}`) }),
                    fetch('/api/services').catch(e => { throw new Error(`Falha ao buscar serviços: ${e.message}`) })
                ])

                if (!clientsRes.ok) {
                    const errorData = await clientsRes.json().catch(() => ({ message: 'Erro desconhecido' }))
                    throw new Error(`Erro API Clientes (${clientsRes.status}): ${errorData.message || clientsRes.statusText}`)
                }

                if (!servicesRes.ok) {
                    const errorData = await servicesRes.json().catch(() => ({ message: 'Erro desconhecido' }))
                    throw new Error(`Erro API Serviços (${servicesRes.status}): ${errorData.message || servicesRes.statusText}`)
                }

                const clientsData = await clientsRes.json()
                const servicesData = await servicesRes.json()

                console.log('Dados recebidos com sucesso:', {
                    clients: clientsData.length,
                    services: servicesData.length
                })

                setClients(clientsData)
                setServices(servicesData)
            } catch (err: any) {
                console.error('ERRO CRÍTICO NA SALES PAGE:', err)
                // Opcional: mostrar um alerta mais informativo se for ambiente dev
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Dica: Verifique se o servidor Next.js está rodando e se o Prisma Client foi gerado.')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const addService = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId)
        if (!service) return

        setSaleItems([...saleItems, {
            serviceId: service.id,
            name: service.name,
            quantity: 1,
            unitPrice: service.price || 0,
            totalPrice: service.price || 0
        }])
    }

    const removeService = (index: number) => {
        setSaleItems(saleItems.filter((_, i) => i !== index))
    }

    const updateQuantity = (index: number, qty: number) => {
        const newItems = [...saleItems]
        newItems[index].quantity = qty
        newItems[index].totalPrice = qty * newItems[index].unitPrice
        setSaleItems(newItems)
    }

    const total = saleItems.reduce((acc, item) => acc + item.totalPrice, 0)
    const finalTotal = total - discount

    const handleSubmit = async () => {
        if (!selectedClient || saleItems.length === 0) return

        setLoading(true)
        try {
            const res = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: selectedClient,
                    items: saleItems,
                    discount,
                    paymentMethod,
                    installments,
                    paymentStatus,
                    notes
                })
            })

            if (res.ok) {
                const data = await res.json()
                // Sale created successfully
                if (data.data?.receivable?.status === 'OPEN' && data.data?.receivable?.id && paymentMethod !== 'CASH') {
                    // It's open and eligible for Mercado Pago link
                    setGeneratedReceivableId(data.data.receivable.id)
                    setIsSuccessModalOpen(true)
                } else {
                    // Paid in cash or fully paid right away
                    alert('Atendimento finalizado com sucesso!')
                    window.location.reload()
                }
            } else {
                alert('Erro ao registrar venda')
            }
        } catch (err) {
            alert('Erro na requisição')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateMPLink = async () => {
        if (!generatedReceivableId) return
        setIsGeneratingMP(true)
        try {
            const res = await fetch('/api/payments/mercadopago/preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receivableId: generatedReceivableId })
            })

            const result = await res.json()
            if (res.ok && result?.data?.init_point) {
                setMpLink(result.data.init_point)
            } else {
                alert(`Erro ao gerar link: ${result?.error || 'Desconhecido'}`)
            }
        } catch (error) {
            alert('Erro na comunicação com o Mercado Pago')
        } finally {
            setIsGeneratingMP(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mpLink)
        alert('Link copiado! Cole no WhatsApp do cliente.')
    }

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false)
        window.location.reload() // Reload to reset the checkout page
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-[#d4af37]">Novo Atendimento</h1>
                <p className="text-gray-400">Registre vendas e gere contas a receber automaticamente.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#1a1a1a] border-yellow-600/10">
                        <CardHeader>
                            <CardTitle className="text-white text-lg font-medium">Informações da Venda</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Cliente</Label>
                                <Select onValueChange={setSelectedClient}>
                                    <SelectTrigger className="bg-[#252525] border-gray-800 text-white">
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                        {clients.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                        {clients.length === 0 && <SelectItem value="no-clients" disabled>Nenhum cliente cadastrado</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-400">Adicionar Serviço</Label>
                                <Select onValueChange={addService}>
                                    <SelectTrigger className="bg-[#252525] border-gray-800 text-white">
                                        <SelectValue placeholder="Escolha um serviço" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                        {services.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name} - {formatCurrency(s.price || 0)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800">
                                            <TableHead className="text-gray-400">Serviço</TableHead>
                                            <TableHead className="text-gray-400">Qtd</TableHead>
                                            <TableHead className="text-gray-400">Preço</TableHead>
                                            <TableHead className="text-gray-400 text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {saleItems.map((item, index) => (
                                            <TableRow key={index} className="border-gray-800">
                                                <TableCell className="text-white font-medium">{item.name}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        className="w-16 bg-[#252525] border-gray-800 text-white"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-gray-400">{formatCurrency(item.unitPrice)}</TableCell>
                                                <TableCell className="text-white text-right font-bold">{formatCurrency(item.totalPrice)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => removeService(index)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {saleItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                    Nenhum serviço adicionado.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Column */}
                <div className="space-y-6">
                    <Card className="bg-[#1a1a1a] border-[#d4af37]/20 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <CardHeader className="border-b border-yellow-600/5">
                            <CardTitle className="text-[#d4af37] flex items-center space-x-2">
                                <Calculator className="w-5 h-5" />
                                <span>Resumo Financeiro</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatCurrency(total)}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <Label>Desconto (R$)</Label>
                                        <Input
                                            type="number"
                                            className="w-24 h-8 bg-[#252525] border-gray-800 text-white text-right"
                                            value={discount / 100}
                                            onChange={(e) => setDiscount(Math.round(parseFloat(e.target.value || '0') * 100))}
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-800 pt-4 flex justify-between">
                                    <span className="text-lg font-bold text-white">Total Líquido</span>
                                    <span className="text-2xl font-black text-[#d4af37]">{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Forma de Pagamento</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
                                        className={paymentMethod === 'CASH' ? 'bg-[#d4af37] text-black hover:bg-[#b8952e]' : 'border-gray-800 text-gray-400'}
                                        onClick={() => setPaymentMethod('CASH')}
                                    >
                                        <Banknote className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant={paymentMethod === 'CREDIT_CARD' ? 'default' : 'outline'}
                                        className={paymentMethod === 'CREDIT_CARD' ? 'bg-[#d4af37] text-black hover:bg-[#b8952e]' : 'border-gray-800 text-gray-400'}
                                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                                    >
                                        <CreditCard className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant={paymentMethod === 'BOLETO' ? 'default' : 'outline'}
                                        className={paymentMethod === 'BOLETO' ? 'bg-[#d4af37] text-black hover:bg-[#b8952e]' : 'border-gray-800 text-gray-400'}
                                        onClick={() => setPaymentMethod('BOLETO')}
                                    >
                                        <Receipt className="w-5 h-5" />
                                    </Button>
                                </div>

                                {paymentMethod === 'CREDIT_CARD' && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Parcelas</Label>
                                        <Select onValueChange={(val) => setInstallments(parseInt(val))}>
                                            <SelectTrigger className="bg-[#252525] border-gray-800 text-white">
                                                <SelectValue placeholder="1x" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#252525] border-gray-800 text-white">
                                                {[1, 2, 3, 4, 5, 6, 10, 12].map(num => (
                                                    <SelectItem key={num} value={num.toString()}>{num}x</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="is-paid"
                                        className="rounded border-gray-800 bg-[#252525] text-[#d4af37]"
                                        checked={paymentStatus === 'PAID'}
                                        onChange={(e) => setPaymentStatus(e.target.checked ? 'PAID' : 'OPEN')}
                                    />
                                    <Label htmlFor="is-paid" className="text-sm text-gray-400">Marcar como Pago no ato</Label>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 bg-[#d4af37] text-black font-bold hover:bg-[#b8952e] transition-all text-base uppercase tracking-wider"
                                onClick={handleSubmit}
                                disabled={loading || saleItems.length === 0}
                            >
                                {loading ? 'Processando...' : 'Finalizar Atendimento'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={isSuccessModalOpen} onOpenChange={closeSuccessModal}>
                <DialogContent className="bg-[#1a1a1a] border-yellow-600/20 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[#d4af37] text-2xl flex items-center">
                            <Receipt className="w-6 h-6 mr-2" /> Venda Finalizada!
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            O atendimento foi registrado com sucesso e a conta a receber foi gerada.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <p className="text-sm font-medium">Você escolheu faturar o cliente. Como ele fará o pagamento via WhatsApp, deseja gerar o Link do Mercado Pago (PIX/Cartão/Boleto) agora?</p>

                        {!mpLink ? (
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12"
                                onClick={handleGenerateMPLink}
                                disabled={isGeneratingMP}
                            >
                                {isGeneratingMP ? 'Gerando Link...' : 'Gerar Link Seguro MP'}
                            </Button>
                        ) : (
                            <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                                <Label className="text-[#d4af37] font-bold text-sm">Link de Pagamento Gerado!</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        readOnly
                                        value={mpLink}
                                        className="bg-[#252525] border-gray-800 text-white flex-1"
                                    />
                                    <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 text-white">
                                        Copiar
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 pt-2">Envie este link via WhatsApp. Assim que o cliente pagar, o sistema dará baixa automaticamente.</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-gray-800 text-gray-400 hover:bg-[#252525] hover:text-white"
                            onClick={closeSuccessModal}
                        >
                            Fechar e Novo Atendimento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
