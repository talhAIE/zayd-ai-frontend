import Navbar from "./navbar";
import HeroSection from "./hero-section";
import LanguageGymSection from "./language-gym-section";
import TutorSection from "./tutor-section";
import ClockworkSection from "./clockwork-section";
import { ReactLenis } from "@/components/lenis";
import { useLanguage } from "@/components/language-provider";
import Footer from "./footer-new";
import CTASection from "./cta-section";

export default function Main() {
  return <PublicLanding />;
}

function PublicLanding() {
  const { language } = useLanguage();
  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        smoothWheel: true,
        duration: 1.2,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
        syncTouch: true,
      }}
    >
      <div
        className="min-h-screen font-geist-sans"
        dir={direction}
        lang={language}
      >
        <Navbar />
        <HeroSection />
        <LanguageGymSection />
        <TutorSection />
        <ClockworkSection />
        <CTASection/>
        <Footer />
      </div>
    </ReactLenis>
  );
}
