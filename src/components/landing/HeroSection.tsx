import { Target, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background/50">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
            </div>

            <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Shield className="w-4 h-4" />
                    <span>Especialistas em SIGMA e SINARM</span>
                </div>

                {/* Headlines */}
                <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
                        Sua Paixão pelo Tiro, <br />
                        <span className="brass-text">Nossa Gestão Burocrática.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Assessoria completa para CACs: do primeiro CR à gestão total do seu acervo com segurança e absoluta legalidade.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <Link
                        href="#servicos"
                        className="w-full sm:w-auto px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 brass-shadow"
                    >
                        <Target className="w-5 h-5" />
                        Quero tirar meu CR
                    </Link>
                    <Link
                        href="#contato"
                        className="w-full sm:w-auto px-8 py-4 rounded-md border border-primary/50 text-foreground hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 tactical-border"
                    >
                        Preciso Regularizar meu Acervo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-muted-foreground animate-in fade-in duration-1000 delay-500">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-primary">100%</span>
                        <span className="text-sm">Dentro da Lei</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-primary">+5k</span>
                        <span className="text-sm">Processos Deferidos</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-primary">24h</span>
                        <span className="text-sm">Suporte Especializado</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-primary">Zero</span>
                        <span className="text-sm">Burocracia para Você</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
