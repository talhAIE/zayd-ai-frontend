import ChineseNavbar from "./ChineseNavbar";
import ChineseHeroSection from "./HeroSection";
import ChineseFeatures from "./ChineseFeatures";
import ChineseSafetySection from "./ChineseSafetySection";
import ChinesePricingSection from "./ChinesePricingSection";
import Footer from "../Footer";
import { useLanguage } from "@/components/language-provider";

export default function ChineseMain() {
  return <ChinesePublicLanding />;
}

function ChinesePublicLanding() {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <ChineseNavbar />
      <ChineseHeroSection />
      <ChineseFeatures />
      <ChineseSafetySection />
      <ChinesePricingSection />
      <Footer />
    </div>
  );
}