// import HeroSection from "./hero-section";
// import Navbar from "./navbar";
// import ConversationSection from "./conversation-section";
// import DashboardSection from "./dashboard-section";
// import FeatureSection from "./feature-section";
// import FlowSection from "./flow-section";
// import PricingTable from "./PricingTable";
// import FAQSection from "./faq-section";
// import LandingCarousel from "./LandingCarousel";
// // import TestimonialsSection from "./testimonials";
// import Footer from "./Footer";
// import { ReactLenis } from "@/components/lenis";
// import { useLanguage } from "@/components/language-provider";

import Navbar from "./navbar-new";
import HeroSection from "./hero-section-new";
import LanguageGymSection from "./language-gym-section";
import TutorSection from "./tutor-section";
import ClockworkSection from "./clockwork-section";
import { ReactLenis } from "@/components/lenis";
import { useLanguage } from "@/components/language-provider";
import CTASection from "./cta-section";
import Footer from "./footer-new";

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

// export default function Main() {
//   return <PublicLanding />;
// }

// function PublicLanding() {
//   const { language } = useLanguage();
//   const direction = language === "ar" ? "rtl" : "ltr";

//   return (
//     <ReactLenis
//       root
//       options={{
//         lerp: 0.05,
//         smoothWheel: true,
//         duration: 1.2,
//         wheelMultiplier: 1.2,
//         touchMultiplier: 1.2,
//         syncTouch: true,
//       }}
//     >
//       <div
//         className="min-h-screen font-geist-sans"
//         dir={direction}
//         lang={language}
//       >
//         <Navbar />
//         <HeroSection />
//         <DashboardSection />
//         <ConversationSection />
//         <FeatureSection />
//         <LandingCarousel />
//         <FlowSection />
//         {/* <TestimonialsSection /> */}
//         <PricingTable />
//         <FAQSection />
//         <Footer />
//       </div>
//     </ReactLenis>
//   );
// }