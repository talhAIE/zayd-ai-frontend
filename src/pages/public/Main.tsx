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

import Navbar from "./navbar-new";
import HeroSection from "./hero-section-new";
import FeatureSection from "./feature-section-new";
import TutorSection from "./tutor-section";
import ChallengeSection from "./challenge-section";
import { ReactLenis } from "@/components/lenis";
import { useLanguage } from "@/components/language-provider";
import ComplianceSection from "./compliance-section";
import JoinNowSection from "./join-now-section";
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
        className="min-h-screen font-geist-sans overflow-clip"
        dir={direction}
        lang={language}
      >
        <Navbar />
        <HeroSection />
        <FeatureSection />
        <TutorSection />
        <ChallengeSection />
        <ComplianceSection />
        <JoinNowSection/>
        <Footer />
      </div>
    </ReactLenis>
  );
}
