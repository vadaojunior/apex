import { ShieldAlert, Crosshair, RefreshCcw, Wrench, SmartphoneNfc } from "lucide-react";

export function ServicesSection() {
    const services = [
        {
            icon: <ShieldAlert className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />,
            title: "Concessão de CR",
            description: "Assessoria completa para você obter seu Certificado de Registro de Caçador, Atirador ou Colecionador junto ao Exército (SIGMA)."
        },
        {
            icon: <Crosshair className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />,
            title: "Posse e Porte",
            description: "Orientações e trâmites processuais para Posse e Porte de arma de fogo de uso permitido junto à Polícia Federal (SINARM)."
        },
        {
            icon: <RefreshCcw className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />,
            title: "Renovação de Certificados",
            description: "Evite multas e apreensões. Cuidamos da renovação tempestiva do seu CR, CRAF e GT, zelando pela sua legalidade."
        },
        {
            icon: <Wrench className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />,
            title: "Apostilamento",
            description: "Inclusão de novas armas, lunetas, máquinas de recarga e outros PCE no seu respectivo acervo e CR."
        },
        {
            icon: <SmartphoneNfc className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />,
            title: "Guia de Tráfego Eletrônica",
            description: "Emissão rápida e segura da GT para você transportar seu armamento para clubes de tiro ou locais de caça autorizados."
        }
    ];

    return (
        <section id="servicos" className="py-24 bg-background/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Nossos <span className="brass-text">Serviços</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Soluções ágeis e 100% embasadas na legislação vigente. Focamos na burocracia para que você foque na precisão do disparo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group glass-card tactical-border p-8 rounded-xl bg-card hover:bg-card/80 transition-all duration-300"
                        >
                            <div className="mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
