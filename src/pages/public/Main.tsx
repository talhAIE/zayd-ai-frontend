import HeroSection from "./hero-section";
import Navbar from "./navbar";
import ConversationSection from "./conversation-section";
import DashboardSection from "./dashboard-section";
import FeatureSection from "./feature-section";
import FlowSection from "./flow-section";
import PricingTable from "./PricingTable";
import FAQSection from "./faq-section";
// import TestimonialsSection from "./testimonials";
import Footer from "./Footer";
import { ReactLenis } from "@/components/lenis";
import { LanguageProvider } from "@/components/language-provider";

export default function Main() {
  return (
    <LanguageProvider>
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
        <div className="min-h-screen font-geist-sans">
          <Navbar />
          <HeroSection />
          <DashboardSection />
          <ConversationSection />
          <FeatureSection />
          <FlowSection />
          {/* <TestimonialsSection /> */}
          <PricingTable />
          <FAQSection />
          <Footer />
        </div>
      </ReactLenis>
    </LanguageProvider>
  );
}
