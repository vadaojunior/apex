"use client";

import Link from "next/link";
import { ShieldCheck, MessageCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function HeaderSection() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Efeito para detectar scroll e mudar o fundo do cabeçalho
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Início", href: "#" },
        { name: "Quem Somos", href: "#quem-somos" },
        { name: "Ser CAC", href: "#sobre" },
        { name: "Renovar", href: "#renovacao-niveis" },
        { name: "Serviços", href: "#servicos" },
        { name: "Dúvidas", href: "#faq" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "py-3 bg-background/80 backdrop-blur-lg border-b border-primary/20 shadow-lg shadow-black/50"
                    : "py-6 bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between">

                {/* Logo Tipográfica */}
                <Link href="/" className="flex flex-col items-center justify-center group">
                    <span className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground leading-none group-hover:scale-105 transition-transform duration-300">
                        <span className="text-primary drop-shadow-md">APEX</span>
                    </span>
                    <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.2em] md:tracking-[0.25em] text-muted-foreground uppercase mt-1 group-hover:text-primary transition-colors">
                        Assessoria em Armas
                    </span>
                </Link>

                {/* Navegação Desktop */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hover:-translate-y-0.5 transform duration-200"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Ações Rápidas (Desktop) */}
                <div className="hidden lg:flex items-center gap-4">
                    <a
                        href="https://wa.me/5516981718271?text=Ol%C3%A1%21%20Gostaria%20de%20informa%C3%A7%C3%B5es%20pela%20APEX%20Assessoria."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
                    >
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        Fale Conosco
                    </a>

                    <div className="w-px h-6 bg-primary/20"></div>

                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-md bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Acesso Restrito
                    </Link>
                </div>

                {/* Botão Mobile Menu */}
                <button
                    className="lg:hidden text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Menu Mobile Expandido */}
            <div className={`lg:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-xl border-b border-primary/20 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-[500px] py-4" : "max-h-0 py-0"}`}>
                <div className="container mx-auto px-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-foreground hover:text-primary py-2 border-b border-white/5"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <a
                            href="https://wa.me/5516981718271?text=Ol%C3%A1%21%20Gostaria%20de%20informa%C3%A7%C3%B5es%20pela%20APEX%20Assessoria."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-[#25D366]/20 text-foreground border border-[#25D366]/50 font-bold"
                        >
                            <MessageCircle className="w-5 h-5 text-[#25D366]" />
                            Chamar no WhatsApp
                        </a>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-primary text-primary-foreground font-bold"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Acesso Restrito do Cliente
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
