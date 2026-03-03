import Image from "next/image";
import { Shield, Target, BookOpen, Briefcase, UserCheck, Star, ShieldCheck } from "lucide-react";
import atiradoraImg from "../../../public/maria-isabel-atiradora.png";

export function AboutUsSection() {
    return (
        <section id="quem-somos" className="py-24 bg-background/50 border-t border-b border-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Imagem / Elemento Visual Lateral */}
                    <div className="lg:w-1/3 relative sticky top-32">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-card tactical-border relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 z-10"></div>
                            <Image
                                src={atiradoraImg}
                                alt="Maria Isabel - Assessora Legal"
                                className="object-cover w-full h-[600px] grayscale group-hover:grayscale-0 transition-all duration-700 blur-[2px] group-hover:blur-0"
                                priority
                            />

                            <div className="absolute bottom-6 left-6 z-20 space-y-2 max-w-[90%]">
                                <div className="p-3 bg-primary/20 rounded-xl inline-block backdrop-blur-md mb-2">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-foreground">Maria Isabel</p>
                                    <p className="text-sm text-primary uppercase tracking-wider font-bold mt-1">
                                        Expertise documental para viabilizar o seu registro com segurança e precisão.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo de Texto Principal */}
                    <div className="lg:w-2/3 space-y-12">

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                                <Target className="w-4 h-4" />
                                <span>Quem Somos</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                                Por que buscar a <span className="text-primary">APEX</span> Assessoria?
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Ingressar no universo CAC exige mais do que apenas vontade; exige conformidade com um ecossistema jurídico em constante mudança. A APEX Assessoria nasce com o propósito de ser a ponte técnica entre o seu objetivo e a legalidade plena.
                            </p>
                            <p className="text-foreground leading-relaxed font-medium">
                                Para quem está começando do zero, a nossa atuação é o diferencial entre um processo célere e um indeferimento administrativo. Veja por que confiar seu registro à nossa equipe:
                            </p>
                        </div>

                        {/* Motivos e Vantagens (Features) */}
                        <div className="grid sm:grid-cols-2 gap-8 pt-4">

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors">
                                <BookOpen className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Expertise Legislativa Atualizada</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    O cenário regulatório brasileiro (Decreto nº 11.615/23 e portarias subsequentes) é complexo. Na APEX, traduzimos a legislação em processos claros, garantindo que seu pedido esteja rigorosamente dentro das novas regras.
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors">
                                <Briefcase className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Gestão de Processos Ponta a Ponta</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Do agendamento dos exames psicotécnicos à filiação em clubes de tiro parceiros, nós gerenciamos cada etapa. Você não precisa se preocupar com siglas ou burocracias do SIGMA; nós cuidamos do protocolo e do acompanhamento.
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors">
                                <Shield className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Segurança Jurídica</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Um erro documental pode gerar não apenas atrasos, mas impedimentos futuros. A APEX Assessoria realiza uma auditoria prévia em toda a sua documentação, eliminando falhas que poderiam comprometer a concessão do seu Certificado de Registro (CR).
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors">
                                <UserCheck className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Atendimento Personalizado</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Entendemos que cada novo atirador ou colecionador tem um perfil. Oferecemos uma consultoria consultiva para orientar sobre os níveis de atirador desportivo e as categorias que melhor se adequam ao seu estilo de vida.
                                </p>
                            </div>

                        </div>

                        {/* Callout: A Diferença APEX */}
                        <div className="mt-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-8 rounded-r-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Star className="w-6 h-6 text-primary" fill="currentColor" />
                                <h3 className="text-2xl font-bold text-foreground">A Diferença APEX</h3>
                            </div>
                            <p className="text-lg text-foreground leading-relaxed italic">
                                "Enquanto o mercado oferece apenas o preenchimento de formulários, a APEX Assessoria oferece uma estratégia de conformidade. Nosso foco é que você obtenha seu registro com a tranquilidade de quem está amparado por especialistas."
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
