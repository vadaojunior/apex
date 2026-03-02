import { FileText, Users, Award, CheckCircle2, ShieldAlert, Star } from "lucide-react";

export function AboutCacSection() {
    const steps = [
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Avaliação de Aptidão",
            description: "O primeiro passo é a realização do exame psicotécnico com psicólogo credenciado e o teste de capacidade técnica com instrutor de tiro certificado.",
        },
        {
            icon: <FileText className="w-8 h-8 text-primary" />,
            title: "Certidões e Idoneidade",
            description: "Coletamos e organizamos todas as certidões negativas de antecedentes criminais nas esferas Federal, Estadual, Militar e Eleitoral.",
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
            title: "Filiação a um Clube de Tiro",
            description: "Para ser um Atirador Desportivo, é obrigatório estar vinculado a uma entidade de tiro devidamente registrada.",
        },
        {
            icon: <Award className="w-8 h-8 text-primary" />,
            title: "Protocolo no SIGMA",
            description: "Com o processo instruído, nossa assessoria realiza o protocolo junto ao Exército Brasileiro, acompanhando cada movimentação até a emissão final do seu CR.",
        }
    ];

    return (
        <section id="sobre" className="py-24 bg-background/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                        Como ingressar no <span className="brass-text">Universo CAC?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Muitos entusiastas acreditam que o processo de se tornar um CAC é inacessível. Na verdade, trata-se de um rito administrativo rigoroso que exige paciência e precisão documental. Para quem está começando agora, o processo é dividido em etapas fundamentais que garantem a legitimidade da posse e do uso de Produtos Controlados pelo Exército (PCE).
                    </p>
                </div>

                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-foreground text-center mb-8">
                        O Passo a Passo para o seu Certificado de Registro (CR)
                    </h3>
                    <p className="text-center text-muted-foreground mb-12">
                        Para obter o seu registro, estruturamos o atendimento em quatro pilares essenciais:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="glass-card tactical-border p-8 rounded-lg flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300 bg-card/60"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                                <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subseção: Por que assessoria? */}
                <div className="glass-card tactical-border p-8 md:p-12 rounded-2xl relative overflow-hidden bg-card/80">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-screen pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                                Por que buscar uma <span className="text-primary">Assessoria</span> para o primeiro registro?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Iniciar o processo de forma independente pode resultar em indeferimentos por erros simples de preenchimento ou falta de documentos específicos. Nossa assessoria atua para:
                            </p>

                            <ul className="space-y-5 pt-4">
                                <li className="flex items-start gap-4">
                                    <ShieldAlert className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Minimizar Riscos</h4>
                                        <p className="text-sm text-muted-foreground">Evitamos falhas processuais que atrasam a concessão do registro.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Conformidade Total</h4>
                                        <p className="text-sm text-muted-foreground">Garantimos que você esteja rigorosamente dentro da nova legislação (Decreto nº 11.615/23).</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Star className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Comodidade</h4>
                                        <p className="text-sm text-muted-foreground">Você foca no aprendizado e na prática esportiva, enquanto nós cuidamos de toda a carga burocrática.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-background/50 border border-primary/20 p-8 rounded-xl relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-xl" />
                            <h4 className="text-lg font-bold text-primary mb-3">Nota de Segurança</h4>
                            <p className="text-foreground leading-relaxed italic">
                                "O Certificado de Registro (CR) é um documento pessoal e intransferível que autoriza a aquisição e o manejo legal de armas de fogo, sendo a porta de entrada para quem busca profissionalismo e legalidade na atividade."
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
