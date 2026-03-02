import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
    const phoneNumber = "5516981718271"; // Replace with real number
    const message = encodeURIComponent("Olá! Vim pelo site da APEX e gostaria de uma assessoria especializada.");

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-10"
            aria-label="Fale conosco no WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
        </a>
    );
}
