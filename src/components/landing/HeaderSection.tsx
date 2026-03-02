import Image from "next/image";
import Link from "next/link";

export function HeaderSection() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
            <div className="container mx-auto flex w-full items-center justify-between">
                <Link href="/" className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-black tracking-tighter text-foreground leading-none">
                        <span className="text-primary drop-shadow-md">APEX</span>
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mt-1">
                        Assessoria em Armas
                    </span>
                </Link>
                <div className="hidden md:flex gap-6">
                    <Link href="#sobre" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        O que é ser CAC
                    </Link>
                    <Link href="#servicos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        Serviços
                    </Link>
                    <Link href="/login" className="text-sm font-medium px-4 py-2 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors tactical-border">
                        Acesso Restrito
                    </Link>
                </div>
            </div>
        </header>
    );
}
