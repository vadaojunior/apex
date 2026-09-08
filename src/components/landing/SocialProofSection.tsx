import { Star, ShieldCheck, FileCheck2, UserCheck } from "lucide-react";

export function SocialProofSection() {
    const testimonials = [
        {
            author: "Carlos E.",
            role: "Atirador Esportivo - Nível 3",
            content: "Processo extremamente transparente e ágil. Minha renovação de CR e autorização de compra saíram sem dores de cabeça e sempre estive informado do status. Nota 10!"
        },
        {
            author: "Julio M.",
            role: "Policial Civil & Instrutor de Tiro",
            content: "A assessoria da APEX foi fundamental para o meu apostilamento e também recomendo de olhos fechados para meus alunos. Conhecem profundamente a legislação bélica."
        },
        {
            author: "Ana T.",
            role: "Nova CAC / Caçadora Excepcional",
            content: "Entrei no mundo do tiro há pouco tempo e achei que a burocracia seria impeditiva. A equipe me acompanhou em cada etapa, desde a filiação ao clube até a emissão da GT."
        }
    ];

    return (
        <section className="py-24 bg-background/50 border-t border-b border-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <ShieldCheck className="w-16 h-16 text-primary mb-2" />
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Processos 100% <span className="brass-text">Dentro da Lei</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        A tranquilidade de saber que seus documentos estão sob a tutela de especialistas certificados.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testi, i) => (
                        <div key={i} className="glass-card tactical-border p-8 py-10 rounded-xl relative flex flex-col justify-between bg-card/70 hover:bg-card transition-all">
                            <div className="absolute top-4 right-4 flex text-primary">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-primary" />
                                ))}
                            </div>
                            <p className="text-muted-foreground italic mb-6 text-sm leading-relaxed">&quot;{testi.content}&quot;</p>
                            <div>
                                <p className="font-black text-foreground text-base">{testi.author}</p>
                                <p className="text-xs text-primary uppercase tracking-wider font-bold mt-0.5">{testi.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center border-t border-primary/10 pt-16">
                    <div className="space-y-2 glass-card tactical-border p-6 rounded-xl">
                        <div className="text-4xl font-black text-primary">5+</div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Anos de Experiência</p>
                    </div>
                    <div className="space-y-2 glass-card tactical-border p-6 rounded-xl">
                        <div className="text-4xl font-black text-primary flex items-center justify-center gap-2">
                            <UserCheck className="text-primary w-8 h-8" /> 5K+
                        </div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Atiradores Atendidos</p>
                    </div>
                    <div className="space-y-2 glass-card tactical-border p-6 rounded-xl">
                        <div className="text-4xl font-black text-primary flex items-center justify-center gap-2">
                            <FileCheck2 className="text-primary w-8 h-8" /> 100%
                        </div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Conformidade Legal</p>
                    </div>
                    <div className="space-y-2 glass-card tactical-border p-6 rounded-xl">
                        <div className="text-4xl font-black text-primary">BR</div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Atuação em Todo o Brasil</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
