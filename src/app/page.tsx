import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutUsSection } from "@/components/landing/AboutUsSection";
import { AboutCacSection } from "@/components/landing/AboutCacSection";
import { CacLevelsSection } from "@/components/landing/CacLevelsSection";
import { GlossarySection } from "@/components/landing/GlossarySection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans z-0">
      {/* Dynamic Tactical Background */}
      <div
        className="fixed inset-0 z-[-1] opacity-60 pointer-events-none bg-repeat"
        style={{
          backgroundImage: "url('/images/bg-tactical.png')",
          backgroundSize: '800px'
        }}
      />

      <div className="relative z-10">
        <HeaderSection />
        <main>
          <HeroSection />
          <AboutUsSection />
          <AboutCacSection />
          <CacLevelsSection />
          <GlossarySection />
          <ServicesSection />
          <SocialProofSection />
          <FaqSection />
        </main>
        <FooterSection />
        <FloatingWhatsApp />
      </div>
    </div>
  );
}
