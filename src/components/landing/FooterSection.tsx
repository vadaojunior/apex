import { MapPin, Phone, Mail, Instagram, Lock, Shield } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background pt-16 pb-8 border-t border-primary/20 mt-12 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Info & CNPJ */}
                    <div className="space-y-6 lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-black tracking-tighter flex items-center gap-2">
                                <span className="text-primary">APEX</span> Assessoria
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Sua assessoria de confiança em processos de armas de fogo. Operamos em estrita conformidade técnica e jurídica para garantir sua segurança e aprovação das licenças pertinentes.
                        </p>

                        {/* Legal Info Box */}
                        <div className="glass-card tactical-border p-4 rounded-lg bg-card/50 text-xs text-muted-foreground space-y-2 mt-4 inline-block w-full">
                            <div className="flex items-center gap-2 mb-2 font-bold text-foreground">
                                <Shield className="w-4 h-4 text-primary" />
                                Informações Legais
                            </div>
                            <p><strong>CNPJ:</strong> <span className="text-foreground">61.824.016/0001-03</span></p>
                            <p><strong>Razão Social:</strong> <br />MARIA ISABEL PADILHA DA SILVA</p>
                            <p className="pt-2 text-primary flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
                                <Lock className="w-3 h-3" /> Situação Regular na RFB
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-1">
                        <h4 className="text-foreground font-bold mb-6 text-lg">Navegação</h4>
                        <ul className="space-y-3">
                            <li><Link href="#quem-somos" className="text-muted-foreground hover:text-primary transition-colors text-sm">Quem Somos</Link></li>
                            <li><Link href="#servicos" className="text-muted-foreground hover:text-primary transition-colors text-sm">Nossos Serviços</Link></li>
                            <li><Link href="#sobre" className="text-muted-foreground hover:text-primary transition-colors text-sm">O que é ser CAC</Link></li>
                            <li><Link href="#contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">Fale Conosco</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-1">
                        <h4 className="text-foreground font-bold mb-6 text-lg">Fale Conosco</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">Ribeirão Preto, SP<br />Atendimento em Território Nacional</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <a href="https://wa.me/5516981718271" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    (16) 98171-8271
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">contato@apexassessoria.com.br</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social / Certifications */}
                    <div className="lg:col-span-1 border-t md:border-t-0 pt-8 md:pt-0 border-border">
                        <h4 className="text-foreground font-bold mb-6 text-lg">Redes Sociais</h4>
                        <div className="flex items-center gap-4 mb-8">
                            <a href="https://www.instagram.com/apexdespachante/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary transition-colors hover:text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>

                        <h4 className="text-foreground font-bold mb-4 text-sm mt-8">Site Seguro e Confiável</h4>
                        <div className="flex gap-2">
                            <div className="bg-white/10 p-2 rounded flex items-center gap-2 text-xs font-semibold px-3 uppercase text-green-400">
                                <Lock className="w-4 h-4" /> SSL
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
                    <p>&copy; {currentYear} APEX Assessoria. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link>
                    </div>
                </div>
            </div>

            {/* Background elements minimal */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        </footer>
    );
}
