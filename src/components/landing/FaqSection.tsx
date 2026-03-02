"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
    const faqs = [
        {
            q: "Quanto tempo demora para sair o meu CR?",
            a: "O prazo costuma variar dependendo da Região Militar (RM) através do SIGMA, mas em média, após o protocolo de todas as etapas (Laudo, Filiação, etc.), o processo leva de 30 a 90 dias úteis nas regiões mais eficientes."
        },
        {
            q: "Quais são os custos envolvidos?",
            a: "Os custos envolvem as taxas GRU (Guia de Recolhimento da União), nossa taxa de assessoria, despesas com laudo psicológico, teste de capacidade técnica e anuidade do clube de tiro. Fazemos um orçamento claro e transparente, sem custos ocultos."
        },
        {
            q: "Como CAC, posso andar armado no carro?",
            a: "Existem premissas estritas na legislação vigente sobre o Porte de Trânsito para atiradores esportivos ao irem e retornarem do clube de tiro ou locais de prova/treinamento (a Guia de Tráfego). É essencial seguir exatamente a lei e o decreto do ano vigente para transportar a arma de fogo desmuniciada ou municiada (dependendo das atualizações legais vigentes), sempre acompanhado de CR, CRAF e GT. Prestamos consultoria jurídica para evitar que você cometa infrações de porte ilegal."
        },
        {
            q: "Acompanham o processo junto a Polícia Federal (SINARM) também?",
            a: "Sim! Somos especialistas também nos protocolos do SINARM para Posse (manter arma em domicílio ou comércio, se preenchidos os requisitos) e Porte de arma de fogo de Defesa Pessoal."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-background/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

                <div className="text-center mb-16 space-y-4">
                    <div className="flex justify-center mb-4"><HelpCircle className="w-12 h-12 text-primary" /></div>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                        Perguntas <span className="brass-text">Frequentes</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Esclareça as principais dúvidas sobre processos, prazos e regras para CACs.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`glass-card border border-primary/10 rounded-lg overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-card/90 border-primary/40' : 'hover:border-primary/30'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-lg hover:text-primary transition-colors focus:outline-none"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 pt-2 text-muted-foreground border-t border-white/5">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
