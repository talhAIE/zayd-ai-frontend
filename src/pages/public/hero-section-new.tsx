import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBird from "@/assets/images/landingpage/hero bird 1.png";
import dumbbellImg from "@/assets/images/landingpage/Object.png";
import LanguageTabSwitcher from "@/components/ui/LanguageTabSwitcher";
import { useLanguage } from "@/components/language-provider";

export default function HeroSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section
      id="home"
      className={`relative flex items-center justify-center bg-white px-4 pt-2 sm:pt-10 pb-4 sm:pb-14 overflow-x-hidden ${isAr ? 'font-almarai' : ''}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Decorative Floating Images - Collision-free fluid positioning (Desktop lg+) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* Left: dumbbell - Responsive positioning and sizing */}
        <motion.div
          className={`absolute left-[2vw] ${isAr ? "2xl:left-[4vw] top-[30%] lg:top-[35%]" : "2xl:left-[6vw] top-[45%] lg:top-[50%]"} -translate-y-1/2 z-0`}
          style={{ width: "clamp(140px, 18vw, 340px)" }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={dumbbellImg}
            alt="Dumbbell"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Right: bird - Responsive positioning and sizing */}
        <motion.div
          className={`absolute right-[2vw] ${isAr ? "2xl:right-[4vw] top-[30%] lg:top-[35%]" : "2xl:left-[6vw] top-[45%] lg:top-[50%]"} -translate-y-1/2 z-0`}
          style={{ width: "clamp(140px, 18vw, 340px)" }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={heroBird}
            alt="Zayd mascot lifting weights"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Main Content wrapper */}
      <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative z-10 px-4">


        {/* Centre: text — full width on mobile, fixed min-width on desktop */}
        <div className="flex flex-col items-center text-center z-10 flex-shrink-0 w-full xl:min-w-[620px] px-4 sm:px-0">
          
          {/* Badge - Arabic Only */}
          {isAr && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <span className="text-xs font-semibold text-[#2B2B2B]">
                زايد AI
              </span>
              <span className="w-1 h-1 rounded-full bg-[#2B2B2B] opacity-40"></span>
              <span className="text-xs font-semibold text-[#2B2B2B] opacity-60">
                أطلق قوة الذكاء الاصطناعي
              </span>
            </motion.div>
          )}

          {/* Language switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mb-7"
          >
            <LanguageTabSwitcher />
          </motion.div>

          {/* Headline — Font size adjusted for mobile */}
          <motion.h1
            className={`text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 px-4 sm:px-0 ${isAr ? "max-w-4xl" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {isAr ? (
              "صالة اللغة للطالب العصري."
            ) : (
              <>
                The Language Gym for
                <br className="hidden sm:block" />
                the Modern Student.
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={`text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed mb-8 max-w-lg px-6 sm:px-0 ${isAr ? 'mt-5' : ''}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            {isAr ? (
              "تمامًا كما تبني الصالة الرياضية عضلاتك، يبني زايد لغتك. مارس الإنجليزية أو الصينية مع تدريب مدعوم بالذكاء الاصطناعي مصمم للطلاقة والدقة والنطق المثالي."
            ) : (
              "Just as the gym builds your muscles, Zayd builds your language. Practice English or Chinese with AI-driven training designed for fluency, accuracy, and perfect prosody."
            )}
          </motion.p>

          {/* Image for Mobile (Bird) — Appears between subtitle and CTA or below on mobile */}
          <motion.div
            className="lg:hidden block w-full max-w-[300px] mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          >
            <img
              src={heroBird}
              alt="Zayd mascot lifting weights"
              className="w-full h-auto object-contain"
              draggable={false}
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold text-white flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)",
                }}
              >
                {isAr ? "ابدأ الممارسة" : "Start Practice"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isAr ? "transform rotate-180" : ""}
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-5 text-[10px] xs:text-xs sm:text-sm text-[#058BF4] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            {isAr ? "لا حاجة لبطاقة ائتمان • انضم إلى آلاف الطلاب" : <>No credit card required&nbsp;•&nbsp;Join thousands of students</>}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
