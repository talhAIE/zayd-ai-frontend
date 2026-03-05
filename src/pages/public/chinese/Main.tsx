import ChineseNavbar from "./ChineseNavbar";
import ChineseHeroSection from "./HeroSection";
import ChineseFeatures from "./ChineseFeatures";
import ChineseSafetySection from "./ChineseSafetySection";
import ChinesePricingSection from "./ChinesePricingSection";
import ChineseFlowSection from "./ChineseFlowSection";
import ChineseFAQSection from "./ChineseFAQSection";
import { useLanguage } from "@/components/language-provider";
import { ReactLenis } from "@/components/lenis";
import ChineseContactUsCard from "./ChineseContactUsCard";

export default function ChineseMain() {
  return <ChinesePublicLanding />;
}

function ChinesePublicLanding() {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

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
      <div className={`min-h-screen bg-white ${language === "ar" ? 'font-almarai' : 'font-nunito'}`} dir={dir}>
        <ChineseNavbar />
        <ChineseHeroSection />
        <ChineseFeatures />
        <ChineseFlowSection />
        <ChineseSafetySection />
        <ChinesePricingSection />
        <ChineseFAQSection /> 
        <ChineseContactUsCard />
      </div>
    </ReactLenis>
  );
}