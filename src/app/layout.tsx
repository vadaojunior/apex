import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

// Para os textos gerais
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Para os títulos imponentes (Tático Premium)
const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APEX | Assessoria em Armas",
  description: "Assessoria documental completa para aquisição, registro e renovação de CAC (Caçador, Atirador, Colecionador).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body
        className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
