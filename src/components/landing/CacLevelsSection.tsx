import { ShieldAlert, AlertTriangle, XOctagon, CheckCircle2, Target, Info, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CacLevelsSection() {
    return (
        <section id="renovacao-niveis" className="py-24 bg-background/50 border-t border-primary/10 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

                {/* Cabeçalho da Seção de Renovação */}
                <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive text-sm font-bold animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Atenção: Prazos e Requisitos Rigorosos</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                        Renovação de CR: Proteja seu Acervo e sua <span className="text-primary">Regularidade</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Para quem já é CAC, o Certificado de Registro (CR) é o documento que sustenta a legalidade de todo o seu investimento e paixão. Com as recentes alterações na legislação brasileira, os prazos e requisitos para a renovação tornaram-se mais rigorosos.
                    </p>
                    <p className="font-medium text-foreground text-lg">
                        Não permita que a burocracia ou o esquecimento coloquem em risco o seu patrimônio. A APEX Assessoria oferece uma gestão especializada para que sua transição para o novo ciclo de validade seja impecável.
                    </p>
                </div>

                {/* Bloco: Riscos de um CR Vencido */}
                <div className="grid lg:grid-cols-3 gap-6 mb-20">
                    <div className="col-span-1 lg:col-span-3">
                        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                            <XOctagon className="text-destructive w-6 h-6" />
                            Os Riscos imediatos de um CR Vencido
                        </h3>
                    </div>

                    <div className="glass-card border border-destructive/20 bg-destructive/5 p-6 rounded-xl hover:bg-destructive/10 transition-colors">
                        <h4 className="font-bold text-foreground text-lg mb-2">Suspensão da Posse e Porte</h4>
                        <p className="text-muted-foreground text-sm">Você perde o direito legal de transportar e utilizar seu armamento de imediato.</p>
                    </div>
                    <div className="glass-card border border-destructive/20 bg-destructive/5 p-6 rounded-xl hover:bg-destructive/10 transition-colors">
                        <h4 className="font-bold text-foreground text-lg mb-2">Risco de Apreensão</h4>
                        <p className="text-muted-foreground text-sm">O acervo mantido com registro vencido pode ser sujeito a pesadas medidas administrativas e criminais.</p>
                    </div>
                    <div className="glass-card border border-destructive/20 bg-destructive/5 p-6 rounded-xl hover:bg-destructive/10 transition-colors">
                        <h4 className="font-bold text-foreground text-lg mb-2">Impedimento de Compra</h4>
                        <p className="text-muted-foreground text-sm">Interrupção imediata do seu direito de aquisição de munições, insumos e novos equipamentos.</p>
                    </div>
                </div>

                {/* Bloco: Por que renovar com a APEX? */}
                <div className="mb-24">
                    <div className="glass-card tactical-border p-8 md:p-12 rounded-2xl bg-card">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2 space-y-6">
                                <h3 className="text-3xl font-bold text-foreground">Por que renovar com a <span className="brass-text">APEX Assessoria?</span></h3>
                                <p className="text-muted-foreground text-lg">
                                    O processo atual de renovação exige a atualização de documentação, além de novas avaliações de aptidão técnica e psicológica. Nós cuidamos de tudo.
                                </p>
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium text-foreground flex gap-3">
                                    <Info className="w-5 h-5 text-primary shrink-0" />
                                    <p>Atenção: Recomenda-se iniciar o processo de renovação com, no mínimo, <strong className="text-primary">90 dias de antecedência</strong> ao vencimento. Evite filas e gargalos no sistema do Exército.</p>
                                </div>
                            </div>

                            <div className="md:w-1/2 grid grid-cols-1 gap-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Auditoria de Acervo</h4>
                                        <p className="text-sm text-muted-foreground">Verificamos se todas as suas armas estão devidamente apostiladas antes de enviar o processo.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Monitoramento de Prazos</h4>
                                        <p className="text-sm text-muted-foreground">Antecipamos o protocolo para evitar que você fique "em hiato" entre o vencimento e o novo registro.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Adequação aos Novos Níveis</h4>
                                        <p className="text-sm text-muted-foreground">Orientamos sobre a comprovação de habitualidade (treinos/competições) exigida pelas normativas.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-foreground">Representação Técnica</h4>
                                        <p className="text-sm text-muted-foreground">Em caso de pendências pelo Exército, nossa equipe técnica responde com precisão jurídica.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divisor Visual */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20"></div>

                {/* Tabela de Níveis de Atirador */}
                <div className="mb-20">
                    <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
                        <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                            Entenda os Novos Níveis de <span className="text-primary">Atirador Desportivo</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            O Decreto nº 11.615/23 mudou o jogo: agora, a renovação e a permanência no esporte dependem diretamente da comprovação de habitualidade. A classificação do atirador define o que ele pode adquirir e manter em seu acervo.
                        </p>
                    </div>

                    <div className="glass-card tactical-border rounded-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/10 border-b border-primary/20">
                                    <th className="p-4 md:p-6 font-bold text-foreground whitespace-nowrap">Requisito / Limite</th>
                                    <th className="p-4 md:p-6 font-bold text-primary whitespace-nowrap">Nível 1 (Iniciante)</th>
                                    <th className="p-4 md:p-6 font-bold text-primary whitespace-nowrap">Nível 2 (Intermediário)</th>
                                    <th className="p-4 md:p-6 font-bold text-primary whitespace-nowrap">Nível 3 (Avançado)</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border hover:bg-card/50 transition-colors">
                                    <td className="p-4 md:p-6 font-semibold text-foreground">Habitualidades</td>
                                    <td className="p-4 md:p-6">8 por ano em clube de tiro</td>
                                    <td className="p-4 md:p-6">12 por ano<br /><span className="text-xs opacity-70">(em 2 modalidades distintas)</span></td>
                                    <td className="p-4 md:p-6">20 por ano<br /><span className="text-xs opacity-70">(em 2 modalidades, 6 em eventos nac/inter)</span></td>
                                </tr>
                                <tr className="border-b border-border hover:bg-card/50 transition-colors">
                                    <td className="p-4 md:p-6 font-semibold text-foreground">Armas Permitidas</td>
                                    <td className="p-4 md:p-6">Até 4 armas<br /><span className="text-xs opacity-70">de uso permitido</span></td>
                                    <td className="p-4 md:p-6">Até 8 armas<br /><span className="text-xs opacity-70">de uso permitido</span></td>
                                    <td className="p-4 md:p-6 font-medium text-foreground">Até 16 armas<br /><span className="text-xs text-primary">(sendo 4 de uso restrito*)</span></td>
                                </tr>
                                <tr className="border-b border-border hover:bg-card/50 transition-colors">
                                    <td className="p-4 md:p-6 font-semibold text-foreground">Munições (por arma)</td>
                                    <td className="p-4 md:p-6">Até 4.000 unidades/ano</td>
                                    <td className="p-4 md:p-6">Até 10.000 unidades/ano</td>
                                    <td className="p-4 md:p-6">Até 20.000 unidades/ano</td>
                                </tr>
                                <tr className="hover:bg-card/50 transition-colors">
                                    <td className="p-4 md:p-6 font-semibold text-foreground rounded-bl-xl">Insumos (Pólvora)</td>
                                    <td className="p-4 md:p-6">Até 3kg</td>
                                    <td className="p-4 md:p-6">Até 6kg</td>
                                    <td className="p-4 md:p-6 rounded-br-xl">Até 12kg</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center italic">
                        * A aquisição de armas de uso restrito para o Nível 3 exige autorização específica e comprovação de participação em competições de alto rendimento.
                    </p>
                </div>

                {/* Bloco: Progressão e Conclusão */}
                <div className="bg-gradient-to-br from-card via-card to-primary/5 tactical-border p-8 md:p-12 rounded-2xl">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Como a APEX Assessoria ajuda na sua Progressão?</h3>
                        <p className="text-muted-foreground">
                            Mudar de nível não é automático; exige uma instrução processual rigorosa junto ao Exército. A APEX Assessoria atua de forma decisiva:
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="text-center p-4 border border-border bg-background/50 rounded-lg">
                            <h4 className="font-bold text-foreground mb-2 text-sm">Auditoria de Habitualidade</h4>
                            <p className="text-xs text-muted-foreground">Conferimos se seus registros de presença atendem aos requisitos do nível almejado.</p>
                        </div>
                        <div className="text-center p-4 border border-border bg-background/50 rounded-lg">
                            <h4 className="font-bold text-foreground mb-2 text-sm">Upgrade de Acervo</h4>
                            <p className="text-xs text-muted-foreground">Solicitamos a autorização de compra para novas categorias conforme você sobe de nível.</p>
                        </div>
                        <div className="text-center p-4 border border-border bg-background/50 rounded-lg">
                            <h4 className="font-bold text-foreground mb-2 text-sm">Apostilamento Rápido</h4>
                            <p className="text-xs text-muted-foreground">Registramos suas novas aquisições de equipamentos no SIGMA com total agilidade.</p>
                        </div>
                        <div className="text-center p-4 border border-border bg-background/50 rounded-lg">
                            <h4 className="font-bold text-foreground mb-2 text-sm">Parcerias Estratégicas</h4>
                            <p className="text-xs text-muted-foreground">Indicamos instrutores e clubes certificados para validar suas habitualidades de forma correta.</p>
                        </div>
                    </div>

                    <div className="text-center max-w-2xl mx-auto space-y-8">
                        <div className="flex items-center justify-center gap-2 text-xl font-bold text-primary">
                            <ShieldAlert className="w-6 h-6" /> Sua Regularidade é Nossa Prioridade
                        </div>
                        <p className="text-foreground text-lg">
                            Seja você um iniciante buscando o primeiro CR ou um atirador experiente precisando de renovação ou progressão de nível, a APEX Assessoria é o seu porto seguro jurídico e administrativo.
                        </p>
                        <p className="text-muted-foreground">O próximo passo para a sua liberdade esportiva começa aqui.</p>

                        <a
                            href="https://wa.me/5516981718271?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20consultoria%20da%20APEX%21"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 duration-300 brass-shadow text-lg w-full sm:w-auto"
                        >
                            Solicitar Consultoria Agora
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
