import { ShieldAlert, Crosshair, RefreshCcw, Wrench, SmartphoneNfc, ArrowRight, ArrowLeftRight } from "lucide-react";

export function ServicesSection() {
    const services = [
        {
            icon: <ShieldAlert className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Concessão de CR",
            description: "Assessoria completa para obtenção do Certificado de Registro de Caçador, Atirador Desportivo ou Colecionador junto ao Exército (SIGMA).",
            whatsappMsg: "Olá! Gostaria de informações sobre a Concessão do meu primeiro CR pela APEX."
        },
        {
            icon: <Crosshair className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Posse e Porte de Defesa",
            description: "Trâmites processuais rigorosos para Posse e Porte de Arma de Fogo de uso permitido junto à Polícia Federal (SINARM).",
            whatsappMsg: "Olá! Preciso de assessoria para registro de Posse/Porte na Polícia Federal."
        },
        {
            icon: <RefreshCcw className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Renovação de Registros",
            description: "Evite a caducidade e o risco de apreensão do acervo. Cuidamos da renovação tempestiva do seu CR, CRAF e GT com total antecedência.",
            whatsappMsg: "Olá! Gostaria de renovar meu CR/CRAF com a APEX Assessoria."
        },
        {
            icon: <Wrench className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Apostilamento de PCE",
            description: "Inclusão legal de novas armas, lunetas, miras ópticas, máquinas de recarga e outros Produtos Controlados no seu acervo.",
            whatsappMsg: "Olá! Quero fazer o apostilamento de equipamentos no meu CR."
        },
        {
            icon: <SmartphoneNfc className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Guia de Tráfego (GT)",
            description: "Emissão rápida e segura da GT eletrônica para transporte do seu armamento para clubes de tiro ou estandes credenciados.",
            whatsappMsg: "Olá! Preciso emitir minha Guia de Tráfego (GT) para clube de tiro."
        },
        {
            icon: <ArrowLeftRight className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />,
            title: "Transferência SIGMA / SINARM",
            description: "Transferência de propriedade de armas entre CACs, do SINARM para o SIGMA ou entre atiradores dentro da legalidade.",
            whatsappMsg: "Olá! Preciso de ajuda com a transferência de propriedade de uma arma."
        }
    ];

    return (
        <section id="servicos" className="py-24 bg-background/50 border-t border-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Nossas Soluções <span className="brass-text">Táticas & Burocráticas</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Soluções ágeis e 100% embasadas no Decreto nº 11.615/23 e normativas vigentes. Cuidamos dos papéis para você focar no estande.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group glass-card tactical-border p-8 rounded-2xl bg-card hover:bg-card/90 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="p-3 bg-primary/10 rounded-xl w-fit border border-primary/20">{service.icon}</div>
                                <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/5">
                                <a
                                    href={`https://wa.me/5516981718271?text=${encodeURIComponent(service.whatsappMsg)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors group-hover:gap-3"
                                >
                                    Solicitar este serviço <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
