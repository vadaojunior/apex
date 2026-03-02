import { ClipboardList, Crosshair, Map } from "lucide-react";

export function GlossarySection() {
    const terms = [
        {
            id: "CR",
            title: "Certificado de Registro",
            subtitle: "A Sua Identidade",
            icon: <ClipboardList className="w-10 h-10 text-primary" />,
            desc: "Documento emitido pelo Exército que confere ao titular o direito de exercer atividades com Produtos Controlados (PCE). É a porta de entrada para o mundo do tiro.",
        },
        {
            id: "CRAF",
            title: "Certificado de Registro de Arma de Fogo",
            subtitle: "O RG da Sua Arma",
            icon: <Crosshair className="w-10 h-10 text-primary" />,
            desc: "Documento que atesta que a arma de fogo está legalmente registrada no sistema competente (SIGMA ou SINARM). Válido como comprovação de propriedade.",
        },
        {
            id: "GT",
            title: "Guia de Tráfego",
            subtitle: "Sua Licença para Transporte",
            icon: <Map className="w-10 h-10 text-primary" />,
            desc: "Autorização para o transporte desmuniciado da arma entre o local de guarda e o estande de tiro ou local de caça autorizado.",
        }
    ];

    return (
        <section className="py-24 bg-background/50 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid lg:grid-cols-3 gap-12 items-center">
                    <div className="space-y-6 lg:col-span-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Glossário de <span className="text-primary">Autoridade</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Termos que todo atirador precisa dominar. Entenda a base da documentação exigida pela legislação brasileira de forma simples e direta.
                        </p>
                        <ul className="space-y-4 pt-4 border-l-2 border-primary/20 pl-6">
                            <li className="text-foreground font-medium">✔️ Emissão segura</li>
                            <li className="text-foreground font-medium">✔️ Acompanhamento processual</li>
                            <li className="text-foreground font-medium">✔️ Renovação descomplicada</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                        {terms.map((term, index) => (
                            <div
                                key={index}
                                className={`glass-card p-6 rounded-lg tactical-border relative overflow-hidden group hover:bg-card/80 transition-colors ${index === 2 ? 'sm:col-span-2' : ''}`}
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-background border border-border shrink-0">
                                        {term.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">
                                                {term.id}
                                            </span>
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-secondary text-secondary-foreground uppercase tracking-wider">
                                                {term.subtitle}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground">{term.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{term.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
