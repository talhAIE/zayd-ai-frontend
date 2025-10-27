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

export default function Main() {
  return (
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
  );
}
