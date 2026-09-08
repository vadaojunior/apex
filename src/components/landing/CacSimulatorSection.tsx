"use client";

import { useState } from "react";
import { Target, Shield, Crosshair, CheckCircle2, ArrowRight, Award, Zap, HelpCircle } from "lucide-react";

interface PerfilCac {
  id: string;
  nome: string;
  categoria: string;
  badge: string;
  habitualidades: string;
  limiteArmas: string;
  municaoAnual: string;
  insumosPolvora: string;
  requisitosChave: string[];
  recomendacaoApex: string;
}

const perfisCac: PerfilCac[] = [
  {
    id: "iniciante",
    nome: "Primeiro CR (Iniciante)",
    categoria: "Novo Atirador / Aspirante",
    badge: "Ingresso no Esporte",
    habitualidades: "Conclusão de Laudos + Filiação a Clube de Tiro",
    limiteArmas: "Concessão inicial de até 4 armas de uso permitido",
    municaoAnual: "Até 4.000 munições por arma cadastrada",
    insumosPolvora: "Até 3kg de pólvora para recarga",
    requisitosChave: [
      "Laudo Psicológico de aptidão mental",
      "Laudo de Capacidade Técnica com Instrutor Certificado",
      "Certidões Negativas (Federal, Estadual, Militar, Eleitoral)",
      "Comprovante de Ocupação Lícita e Residência Fixa"
    ],
    recomendacaoApex: "Fazemos o acompanhamento completo do primeiro protocolo no SIGMA/Exército do zero à concessão do CR."
  },
  {
    id: "nivel1",
    nome: "Atirador Desportivo - Nível 1",
    categoria: "Iniciante no Tiro Esportivo",
    badge: "Nível 1",
    habitualidades: "8 habitualidades anuais em clube de tiro",
    limiteArmas: "Até 4 armas de uso permitido",
    municaoAnual: "Até 4.000 unidades por ano / por arma",
    insumosPolvora: "Até 3kg de pólvora para recarga",
    requisitosChave: [
      "Comprovação de 8 treinos/habitualidades no ano",
      "Filiação ativa a entidade de tiro registrada",
      "Certidões criminais atualizadas",
      "Renovação de CR a cada 3 a 5 anos"
    ],
    recomendacaoApex: "Auditoria preventiva das suas declarações de habitualidade para garantir a manutenção do seu nível."
  },
  {
    id: "nivel2",
    nome: "Atirador Desportivo - Nível 2",
    categoria: "Intermediário Esportivo",
    badge: "Nível 2",
    habitualidades: "12 habitualidades anuais (em 2 modalidades distintas)",
    limiteArmas: "Até 8 armas de uso permitido",
    municaoAnual: "Até 10.000 unidades por ano / por arma",
    insumosPolvora: "Até 6kg de pólvora para recarga",
    requisitosChave: [
      "12 habitualidades comprovadas em sistema de clube",
      "Participação em pelo menos 2 modalidades de provas",
      "Apostilamento regularizado no acervo SIGMA",
      "Comprovação documental rigorosa junto ao Exército"
    ],
    recomendacaoApex: "Suporte completo no upgrade de acervo e autorização de compra de novos equipamentos."
  },
  {
    id: "nivel3",
    nome: "Atirador Desportivo - Nível 3",
    categoria: "Competidor de Alto Rendimento",
    badge: "Nível 3 (Avançado)",
    habitualidades: "20 habitualidades anuais (6 em provas estaduais/nacionais)",
    limiteArmas: "Até 16 armas (sendo até 4 de uso restrito*)",
    municaoAnual: "Até 20.000 unidades por ano / por arma",
    insumosPolvora: "Até 12kg de pólvora para recarga",
    requisitosChave: [
      "20 habitualidades anuais comprovadas",
      "Mínimo de 6 participações em competições estaduais ou nacionais",
      "Aprovação de autorização específica para calibres restritos",
      "Acompanhamento técnico prioritário"
    ],
    recomendacaoApex: "Assessoria técnica especializada para requerimento de calibres restritos e competições de alto nível."
  },
  {
    id: "cacador",
    nome: "Caçador / Controle de Fauna",
    categoria: "Manejo e Controle de Espécies",
    badge: "Caçador Excepcional",
    habitualidades: "Relatórios de manejo e autorização do IBAMA (SIMAF)",
    limiteArmas: "Conforme autorização de manejo autorizada pelo órgão ambiental",
    municaoAnual: "Munições específicas para o plano de manejo cadastrado",
    insumosPolvora: "Insumos autorizados para recarga específica",
    requisitosChave: [
      "Cadastro e Autorização ativa no SIMAF / IBAMA",
      "Declaração de anuência do proprietário da área de manejo",
      "CR ativo com apostilamento da atividade de caça",
      "Guia de Tráfego específica para locais autorizados"
    ],
    recomendacaoApex: "Regularização de documentação de abate de javali/fauna e expedição de Guias de Tráfego ambientais."
  },
  {
    id: "colecionador",
    nome: "Colecionador de Armas de Fogo",
    categoria: "Preservação Histórica e Acervo",
    badge: "Colecionador",
    habitualidades: "Preservação de acervo sem habitualidades esportivas obrigatórias",
    limiteArmas: "Variável conforme plano de coleção aprovado e vistoria técnica",
    municaoAnual: "Proibida aquisição de munição para armas de coleção (mecanismo desativado/histórico)",
    insumosPolvora: "Restrito",
    requisitosChave: [
      "Relatório descritivo de acervo histórico e bélico",
      "Local de guarda com segurança reforçada e vistoriado pelo Exército",
      "Vedado o uso em estandes de tiro sem Guia de Exposição",
      "Atualização periódica do mapa de acervo"
    ],
    recomendacaoApex: "Elaboração de processos de transferência, vistoria de segurança e apostilamento de acervo histórico."
  }
];

export function CacSimulatorSection() {
  const [selectedId, setSelectedId] = useState<string>("iniciante");
  const perfilAtivo = perfisCac.find((p) => p.id === selectedId) || perfisCac[0];

  const getWhatsAppLink = (perfil: PerfilCac) => {
    const texto = encodeURIComponent(
      `Olá! Estava navegando no site da APEX e gostaria de uma consultoria sobre o perfil: *${perfil.nome}*. Como podemos dar início ao meu processo?`
    );
    return `https://wa.me/5516981718271?text=${texto}`;
  };

  return (
    <section id="simulador" className="py-24 bg-background/80 border-t border-b border-primary/20 relative overflow-hidden">
      {/* Background Reticle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <Crosshair className="w-[600px] h-[600px] text-primary animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-primary" />
            <span>Simulador de Requisitos Legais (Decreto 11.615/23)</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Descubra as Regras do seu <span className="brass-text">Perfil CAC</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Selecione o seu momento atual ou objetivo no esporte para entender de forma clara os limites de acervo, habitualidades exigidas e como a APEX garante a sua conformidade.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {perfisCac.map((perfil) => {
            const isSelected = perfil.id === selectedId;
            return (
              <button
                key={perfil.id}
                onClick={() => setSelectedId(perfil.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between h-24 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(234,179,8,0.3)] font-bold scale-105"
                    : "bg-card/70 border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card"
                }`}
              >
                <span className="text-xs uppercase font-extrabold tracking-wider opacity-80">
                  {perfil.badge}
                </span>
                <span className="text-sm font-black line-clamp-2 leading-tight">
                  {perfil.nome.split(" - ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Card */}
        <div className="glass-card tactical-border p-6 md:p-10 rounded-2xl bg-card/90">
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Coluna Esquerda: Especificações */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-xl text-primary border border-primary/30">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    {perfilAtivo.categoria}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground">
                    {perfilAtivo.nome}
                  </h3>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-background/60 border border-primary/15 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-primary" /> Habitualidade Exigida
                  </span>
                  <p className="text-sm font-extrabold text-foreground">{perfilAtivo.habitualidades}</p>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-primary/15 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-primary" /> Limite de Acervo
                  </span>
                  <p className="text-sm font-extrabold text-foreground">{perfilAtivo.limiteArmas}</p>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-primary/15 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Cota de Munições
                  </span>
                  <p className="text-sm font-extrabold text-foreground">{perfilAtivo.municaoAnual}</p>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-primary/15 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" /> Recarga / Insumos
                  </span>
                  <p className="text-sm font-extrabold text-foreground">{perfilAtivo.insumosPolvora}</p>
                </div>
              </div>

              {/* Lista de Requisitos Obrigatórios */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Requisitos e Documentos Necessários:
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {perfilAtivo.requisitosChave.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/40 p-2.5 rounded-lg border border-white/5">
                      <span className="text-primary font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita: Recomendação & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full bg-gradient-to-br from-primary/10 via-background/80 to-background border border-primary/30 p-6 md:p-8 rounded-xl space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <HelpCircle className="w-4 h-4" /> Diagnóstico APEX Assessoria
                </div>
                <h4 className="text-xl font-bold text-foreground leading-snug">
                  Como a APEX viabiliza este objetivo para você?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                  "{perfilAtivo.recomendacaoApex}"
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-primary/20">
                <a
                  href={getWhatsAppLink(perfilAtivo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-black uppercase text-sm tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-3 brass-shadow group"
                >
                  <Target className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  Iniciar Processo para este Perfil
                  <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-[10px] text-center text-muted-foreground font-medium">
                  Atendimento individual e personalizado com garantia de conformidade legal.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
