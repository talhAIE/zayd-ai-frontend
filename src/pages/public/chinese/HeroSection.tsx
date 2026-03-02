import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import guyImage from "@/assets/images/chinese-landingpage/guy 1.png";
import heroBookImage from "@/assets/images/chinese-landingpage/hero book 1.png";
import LanguageTabSwitcher from "@/components/ui/LanguageTabSwitcher";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";

export default function ChineseHeroSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section
      id="home"
      className="pt-12 pb-12 min-[639px]:pt-10 min-[639px]:pb-0 max-[1024px]:pt-10 max-[1024px]:pb-0 min-[1025px]:pt-12 min-[1025px]:pb-12 flex flex-col items-center justify-center text-center relative px-3 bg-white font-geist"
    >
      {/* SADAIA Badge */}
      <motion.div
        className="bg-[#E4F2E7] text-[#35AB4E] px-4 py-1.5 rounded-full text-sm font-extrabold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {isAr ? "معتمد من سدايا (SADAIA)" : "Certified by SADAIA"}
      </motion.div>

      {/* Language Switcher */}
      <div className="mb-2">
        <LanguageTabSwitcher />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* Books Image - Dynamic Positioning & CSS Flip */}
        <motion.div
            className={`absolute ${isAr ? "left-[-16rem]" : "right-[-16rem]"} top-[35%] translate-y-[-50%] xl:flex hidden z-10`}
            initial={{ x: isAr ? -100 : 100, opacity: 0, scaleX: isAr ? 1 : -1 }}
            animate={{ x: 0, opacity: 1, scaleX: isAr ? 1 : -1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
            <img
                src={heroBookImage}
                alt="Learning Resources"
                width={320}
                height={320}
            />
        </motion.div>

        {/* Mascot Image - Dynamic Positioning & CSS Flip */}
        <motion.div
          className={`absolute ${isAr ? "right-[-16rem]" : "left-[-16rem]"} top-[35%] translate-y-[-50%] xl:flex hidden z-10`}
          initial={{ x: isAr ? 100 : -100, opacity: 0, scaleX: isAr ? 1 : -1 }}
          animate={{ x: 0, opacity: 1, scaleX: isAr ? 1 : -1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <img
            src={guyImage}
            alt="Zayd Mascot"
            width={380}
            height={380}
          />
        </motion.div>

        {/* Main Header */}
        <motion.h1
          className="sm:text-[64px] text-4xl font-extrabold text-[#121212] mb-8 max-w-4xl leading-[1.2] tracking-tight overflow-visible"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {isAr ? "منصة زيد للذكاء الاصطناعي – منصة سعودية للتعلم الآمن للغات مدعومة بالذكاء الاصطناعي" : "Zayd AI Platform – Secure Saudi AI-Powered Language Learning"}
        </motion.h1>

        {/* Subheader */}
        <motion.p
          className="text-[#6B7280] text-lg sm:text-[20px] font-medium max-w-[800px] leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          {isAr 
            ? "منصة تعلّم لغات بالذكاء الاصطناعي للغة الإنجليزية والصينية، مصممة خصيصًا لطلاب ومدارس وأسر المملكة العربية السعودية – باستخدام تقنية معتمدة من الهيئة السعودية للبيانات والذكاء الاصطناعي سدايا وتوفر حماية بيانات كاملة."
            : "AI-powered language learning platform for English and Chinese, specifically designed for students, schools, and families in Saudi Arabia – using technology certified by SADAIA with full data protection."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <Link to="/signup">
            <Button
              className="bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm md:text-xl font-bold rounded-lg border-b-2 border-[#20672F] flex items-center justify-center gap-2 transition active:translate-y-[1px] active:border-b-0 px-8 md:px-12 py-6 md:py-8 shadow-md h-16 md:h-20 w-full sm:w-auto"
            >
              {isAr ? "ابدأ تجربتك المدرسية المجانية" : "Start Your Free School Trial"}
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-2 border-gray-200 text-[#4B5563] rounded-lg px-8 md:px-12 py-6 md:py-8 text-sm md:text-xl font-bold hover:bg-gray-50 transition-all active:translate-y-[1px] active:border-b-0 h-16 md:h-20 w-full sm:w-auto flex items-center justify-center"
          >
            {isAr ? "استكشف برامج الإنجليزية والصينية" : "Explore English & Chinese Programs"}
          </Button>
        </motion.div>

        {/* Features Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl px-4 pb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        >
          {[
            {
              text: isAr ? "برامج إنجليزية وصينية للمرحلة الابتدائية العليا والمتوسطة والثانوية" : "English and Chinese programs for upper elementary, middle, and high school",
              icon: <EmojiIcon emoji="✓" size={28} className="text-[#35AB4E]" />
            },
            {
              text: isAr ? "مصممة للمتعلمين العرب، وبمحتوى يراعي القيم المحلية" : "Designed for Arab learners, with content respecting local values",
              icon: <EmojiIcon emoji="✓" size={28} className="text-[#35AB4E]" />
            },
            {
              text: isAr ? "مخصصة للمدارس، مع لوحات تحكم للمعلمين والإداريين" : "Dedicated for schools, with dashboards for teachers and administrators",
              icon: <EmojiIcon emoji="✓" size={28} className="text-[#35AB4E]" />
            }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-3 md:gap-4 bg-[#F9FAFB] p-4 md:p-8 rounded-[16px] md:rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${isAr ? "text-right" : "text-left"}`}>
              {item.icon}
              <p className="text-[#374151] font-bold text-sm md:text-lg leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
