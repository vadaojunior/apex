import Image from "next/image";
import { Shield, Target, BookOpen, Briefcase, UserCheck, Star, ShieldCheck, Lock } from "lucide-react";
import atiradoraImg from "../../../public/maria-isabel-atiradora.png";

export function AboutUsSection() {
    return (
        <section id="quem-somos" className="py-24 bg-background/50 border-t border-b border-primary/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Imagem / Elemento Visual Lateral */}
                    <div className="lg:w-1/3 relative sticky top-32 w-full">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-card tactical-border relative group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 z-10"></div>
                            <Image
                                src={atiradoraImg}
                                alt="Maria Isabel - Assessora Legal e Especialista em Armas"
                                className="object-cover w-full h-[550px] grayscale group-hover:grayscale-0 transition-all duration-700 blur-[1px] group-hover:blur-0"
                                priority
                            />

                            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                                <div className="p-3 bg-primary/20 rounded-xl inline-block backdrop-blur-md mb-2 border border-primary/30">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-foreground">Maria Isabel Padilha</p>
                                    <p className="text-xs text-primary uppercase tracking-wider font-bold mt-1">
                                        Especialista em Regularização CAC & Legislação Bélica
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-primary" /> CNPJ: 61.824.016/0001-03
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo de Texto Principal */}
                    <div className="lg:w-2/3 space-y-12">

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                <Target className="w-4 h-4" />
                                <span>Quem Somos & Autoridade Legal</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                                Por que buscar a <span className="brass-text">APEX Assessoria?</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Ingressar e manter-se regular no universo CAC exige mais do que apenas interesse; exige total conformidade com um ecossistema jurídico dinâmico. A APEX Assessoria nasce com o propósito de ser a ponte técnica e transparente entre a sua paixão pelo tiro e a legalidade plena.
                            </p>
                            <p className="text-foreground leading-relaxed font-medium">
                                Seja para o seu primeiro registro ou para a renovação e adequação do seu acervo ao novo Decreto nº 11.615/23, nossa atuação previne pendências e indeferimentos administrativos.
                            </p>
                        </div>

                        {/* Motivos e Vantagens (Features) */}
                        <div className="grid sm:grid-cols-2 gap-8 pt-4">

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors bg-card/60">
                                <BookOpen className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Expertise Legislativa Atualizada</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Acompanhamos em tempo real o Decreto nº 11.615/23, Portarias da Colog e diretrizes do Exército e da Polícia Federal, garantindo processos 100% alinhados com as normas vigentes.
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors bg-card/60">
                                <Briefcase className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Gestão de Processos Ponta a Ponta</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Do agendamento dos exames psicotécnicos e testes práticos de tiro até a filiação em clubes parceiros, gerenciamos cada detalhe burocrático para você.
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors bg-card/60">
                                <Shield className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Segurança Jurídica Preventiva</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Um erro simples de preenchimento pode gerar atrasos de meses ou indeferimento. Realizamos uma auditoria prévia detalhada em toda a sua documentação.
                                </p>
                            </div>

                            <div className="glass-card tactical-border p-6 rounded-xl space-y-4 hover:border-primary/50 transition-colors bg-card/60">
                                <UserCheck className="w-10 h-10 text-primary" />
                                <h3 className="text-xl font-bold text-foreground">Consultoria de Perfil Personalizada</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Orientamos atiradores iniciantes e veteranos sobre como comprovar habitualidades e alcançar a progressão de nível de forma estratégica.
                                </p>
                            </div>

                        </div>

                        {/* Callout: A Diferença APEX */}
                        <div className="mt-8 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-l-4 border-primary p-8 rounded-r-xl tactical-border">
                            <div className="flex items-center gap-3 mb-3">
                                <Star className="w-6 h-6 text-primary fill-primary" />
                                <h3 className="text-2xl font-bold text-foreground">A Compromisso APEX</h3>
                            </div>
                            <p className="text-base md:text-lg text-foreground leading-relaxed italic">
                                &quot;Enquanto o mercado se limita ao preenchimento de formulários, a APEX Assessoria oferece uma estratégia completa de conformidade. Nosso foco é que você exercite sua prática esportiva com a tranquilidade de estar 100% amparado por especialistas.&quot;
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
