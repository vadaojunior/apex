"use client";

import { useEffect, useState } from "react";
import { Newspaper, ArrowRight, ExternalLink, Calendar } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    imageUrl: string;
    source: string;
}

export function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch('/api/news');
                if (response.ok) {
                    const data = await response.json();
                    setNews(data);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, []);

    return (
        <section id="noticias" className="py-24 bg-background/50 border-t border-primary/10 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                            <Newspaper className="w-4 h-4" />
                            <span>Informativo APEX</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                            Notícias e <span className="brass-text">Atualizações</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Fique por dentro das últimas resoluções do Exército, Polícia Federal e lançamentos da indústria bélica mundial (Taurus, Glock, etc).
                        </p>
                    </div>

                    <a href="#noticias" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold group">
                        Ver todas as atualizações
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card tactical-border rounded-xl h-96 animate-pulse bg-card/50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group glass-card tactical-border rounded-xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(184,134,11,0.15)] bg-card"
                            >
                                {/* Imagem */}
                                <div className="h-48 w-full overflow-hidden relative bg-muted">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/logosite.png';
                                            (e.target as HTMLImageElement).className = 'w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700';
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-background/90 backdrop-blur-sm border border-border text-foreground text-xs font-bold rounded uppercase tracking-wider">
                                            {item.source}
                                        </span>
                                    </div>
                                </div>

                                {/* Conteudo */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-3">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(item.pubDate).toLocaleDateString('pt-BR')}
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {item.contentSnippet}
                                    </p>

                                    <div className="mt-auto flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
                                        Ler matéria <ExternalLink className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
