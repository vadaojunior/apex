import { Target, Shield, ArrowRight, Crosshair, Award } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-background/50">
            {/* Dynamic Background Reticle & Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] mix-blend-screen" />
                <Crosshair className="w-[550px] h-[550px] text-primary/10 stroke-[1] animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-10" />
            </div>

            <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-10 max-w-5xl">

                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Especialistas em SIGMA (Exército) e SINARM (Polícia Federal)</span>
                </div>

                {/* Headlines */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                        Sua Paixão pelo Tiro, <br />
                        <span className="brass-text">Nossa Gestão Burocrática.</span>
                    </h1>
                    <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Assessoria documental completa para atiradores desportivos, caçadores e colecionadores. Do primeiro CR à gestão de acervo com total segurança jurídica.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <Link
                        href="#simulador"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2.5 brass-shadow group hover:scale-105"
                    >
                        <Target className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        Simular Meu Perfil CAC
                    </Link>
                    <a
                        href="https://wa.me/5516981718271?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20para%20regularizar%20meu%20CR%20ou%20acervo%21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl border border-primary/40 text-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/10 transition-all flex items-center justify-center gap-2.5 tactical-border hover:scale-105"
                    >
                        Falar com Especialista
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-muted-foreground animate-in fade-in duration-1000 delay-500 border-t border-primary/10">
                    <div className="glass-card tactical-border p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                        <span className="text-3xl font-black text-primary">100%</span>
                        <span className="text-xs uppercase font-bold text-foreground">Conformidade Legal</span>
                    </div>
                    <div className="glass-card tactical-border p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                        <span className="text-3xl font-black text-primary">+5.000</span>
                        <span className="text-xs uppercase font-bold text-foreground">Processos Deferidos</span>
                    </div>
                    <div className="glass-card tactical-border p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                        <span className="text-3xl font-black text-primary">24h</span>
                        <span className="text-xs uppercase font-bold text-foreground">Suporte Especializado</span>
                    </div>
                    <div className="glass-card tactical-border p-4 rounded-xl flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center gap-1 text-3xl font-black text-primary">
                            <Award className="w-7 h-7" /> BR
                        </div>
                        <span className="text-xs uppercase font-bold text-foreground">Atuação Nacional</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
