import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";
import flagChina from "@/assets/svgs/flag-china.svg";

// Image Imports
import birdImg from "@/assets/images/chinese-landingpage/bird 1.png";
import guyImg from "@/assets/images/chinese-landingpage/guy 2.png";

export default function ChineseFeatures() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const { language } = useLanguage();
  const isAr = language === "ar";

  const studentFeatures = [
    {
      title: isAr ? "دروس موجهة" : "Guided Lessons",
      description: isAr ? "وحدات منظمة متوافقة مع مواضيع منهج وزارة التعليم" : "Structured units aligned with Ministry of Education curriculum topics",
      footer: isAr ? "متوافق مع المنهج الدراسي" : "Curriculum Aligned",
      icon: <EmojiIcon emoji="📚" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "ممارسة الذكاء الاصطناعي" : "AI Practice",
      description: isAr ? "شاهد، اسمع، واستخدم كلمات جديدة مع ردود فعل فورية من الذكاء الاصطناعي" : "Watch, listen, and use new words with instant AI feedback",
      footer: isAr ? "ردود فعل فورية" : "Instant Feedback",
      icon: <EmojiIcon emoji="🎯" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "دعم اللغة العربية" : "Arabic Support",
      description: isAr ? "تعليمات باللغة العربية عند الحاجة للوضوح والثقة" : "Arabic instructions when needed for clarity and confidence",
      footer: isAr ? "تقليل الارتباك" : "Reduced Confusion",
      icon: <EmojiIcon emoji="🌍" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "تعلم ممتع" : "Fun Learning",
      description: isAr ? "سلاسل، نقاط، ولوحات متصدرين للمنافسة الصحية" : "Streaks, points, and leaderboards for healthy competition",
      footer: isAr ? "ابقَ متحمساً" : "Stay Motivated",
      icon: <EmojiIcon emoji="⭐" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
  ];

  const teacherFeatures = [
    {
      title: isAr ? "لوحة تحكم المعلم" : "Teacher Dashboard",
      description: isAr ? "تتبع تقدم الطلاب الفردي والجماعي في الوقت الفعلي" : "Track individual and group student progress in real-time",
      footer: isAr ? "تتبع دقيق" : "Precise Tracking",
      icon: <EmojiIcon emoji="👥" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "تقارير ذكية" : "Smart Reports",
      description: isAr ? "تقارير مفصلة عن نقاط القوة والضعف لكل طالب" : "Detailed reports on each student's strengths and weaknesses",
      footer: isAr ? "تحليل معمق" : "Deep Analysis",
      icon: <EmojiIcon emoji="📊" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "إدارة الفصول" : "Classroom Management",
      description: isAr ? "أضف الطلاب، فرّق المهام، وراقب التفاعل بسهولة" : "Add students, differentiate tasks, and monitor interaction easily",
      footer: isAr ? "سهولة الإدارة" : "Easy Management",
      icon: <EmojiIcon emoji="🎓" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "محتوى إثرائي" : "Enrichment Content",
      description: isAr ? "وصول إلى مكتبة واسعة من الدروس والموارد الإضافية" : "Access to a vast library of extra lessons and resources",
      footer: isAr ? "موارد غنية" : "Rich Resources",
      icon: <EmojiIcon emoji="📚" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
  ];

  const features = activeTab === "students" ? studentFeatures : teacherFeatures;

  return (
    <section id="features" className={`py-12 px-6 bg-white overflow-hidden ${isAr ? 'font-almarai' : 'font-nunito'} overflow-x-hidden relative`} dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-[#E5F3E9] px-6 py-2 rounded-full border border-[#D1EBD9] mb-8"
          >
            <img src={flagChina} alt="China Flag" className="w-5 h-5 text-[#35AB4E]" />
            <span className="text-[#35AB4E] font-bold">
                {isAr ? "برنامج تعلم اللغة الصينية" : "Chinese Language Learning Program"}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-[clamp(1.5rem,3.5vw,2.5rem)] font-black text-[#121212] mb-6 leading-tight"
          >
            {isAr ? "تعلم الصينية مع" : "Learn Chinese with"} <span className="text-[#35AB4E]">{isAr ? "ذكاء زيد الاصطناعي" : "Zayd AI"}</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-[#6B7280] text-base sm:text-lg lg:text-xl font-medium"
          >
            {isAr ? "دروس صينية مدعومة بالذكاء الاصطناعي لطلاب المدارس المتوسطة والثانوية في السعودية" : "AI-powered Chinese lessons for middle and high school students in Saudi Arabia"}
          </motion.p>
        </div>

        {/* Floating Mascots Container - Full Width for Features section */}
        <div className="absolute inset-0 pointer-events-none hidden min-[1024px]:block overflow-hidden">
          {/* Top Bird Mascot - Edge-pinned collision-free positioning */}
          <motion.img 
            src={birdImg} 
            alt="Mascot Bird" 
            className={`absolute top-0 ${isAr ? "right-[2vw] 2xl:right-[6vw]" : "left-[2vw] 2xl:left-[6vw]"} w-[clamp(100px,12vw,200px)] h-auto z-0 transition-all duration-500`}
            initial={{ opacity: 0, x: isAr ? 50 : -50, rotate: isAr ? 10 : -10, scaleX: isAr ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, scaleX: isAr ? 1 : -1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.6,
              type: "spring",
              stiffness: 100,
            }}
          />

          {/* Bottom Guy Mascot - Edge-pinned collision-free positioning */}
          <motion.img 
            src={guyImg} 
            alt="Mascot Guy" 
            className={`absolute top-[48%] -translate-y-1/2 ${isAr ? "left-[2vw] 2xl:left-[6vw]" : "right-[2vw] 2xl:right-[6vw]"} w-[clamp(150px,18vw,300px)] h-auto z-0 transition-all duration-500`}
            initial={{ opacity: 0, x: isAr ? -50 : 50, scaleX: isAr ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0, scaleX: isAr ? 1 : -1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.4,
              type: "spring",
              stiffness: 100,
            }}
          />
        </div>

        {/* Features Split Section - Essential Topics vs Saudi Students */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16" dir={isAr ? "rtl" : "ltr"}>
          {/* Essential Topics Card (Left Side in design) */}
          <motion.div 
            initial={{ opacity: 0, x: isAr ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#C1E6C9] p-5 sm:p-8 rounded-[32px] relative overflow-hidden"
          >
            {/* Background Decorative Circle */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#A8D9B3] rounded-full -mr-12 -mt-12 opacity-50" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <EmojiIcon emoji="🎯" size={32} />
                </div>
                <div>
                  <p className="text-[#35AB4E] font-extrabold text-sm uppercase tracking-wider leading-none mb-1">
                    {isAr ? "ما سيتعلمه الطلاب" : "WHAT STUDENTS LEARN"}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121212]">
                    {isAr ? "المواضيع الأساسية" : "Essential Topics"}
                  </h3>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {[
                  { emoji: "👋", text: isAr ? "تحيات" : "Greetings" },
                  { emoji: "🏫", text: isAr ? "حياة المدرسة" : "School Life" },
                  { emoji: "👨‍👩‍👧‍👦", text: isAr ? "عائلة" : "Family" },
                  { emoji: "🔢", text: isAr ? "أرقام" : "Numbers" },
                  { emoji: "⏰", text: isAr ? "وقت" : "Time" },
                  { emoji: "🛍️", text: isAr ? "تسوق" : "Shopping" },
                  { emoji: "✈️", text: isAr ? "سفر" : "Travel" },
                ].map((topic, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-4 shadow-sm ${idx === 6 ? "col-span-2" : ""}`}
                  >
                    <span className="text-lg sm:text-2xl shrink-0">{topic.emoji}</span>
                    <span className="font-bold text-[#35AB4E] text-xs sm:text-lg">{topic.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Built for Saudi Students */}
          <div className={`space-y-8 ${isAr ? "text-right" : "text-left"}`}>
            <motion.div 
              initial={{ opacity: 0, x: isAr ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-10 bg-[#35AB4E] rounded-full" />
              <h3 className="text-4xl font-black text-[#121212]">
                {isAr ? "مصمم لطلاب السعودية" : "Built for Saudi Students"}
              </h3>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, x: isAr ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-[#6B7280] text-lg leading-relaxed font-medium"
            >
              {isAr 
                ? "تم تصميم دروس زيد AI الصينية خصيصاً لطلاب المدارس المتوسطة والثانوية في السعودية. ابني مفردات ومهارات محادثة صينية حقيقية مع دعم باللغة العربية، لتبقى واثقاً بدلاً من الشعور بالضياع."
                : "Zayd AI Chinese is created specifically for Saudi middle and high school students. Build real-life Chinese vocabulary and conversation skills with Arabic support, so you stay confident instead of feeling lost."}
            </motion.p>

            <div className="space-y-4">
              <PointCard 
                icon={<EmojiIcon emoji="⚡" size={24} className="text-[#35AB4E]" />} 
                title={isAr ? "جلسات قصيرة ومركزة" : "Short, Focused Sessions"} 
                desc={isAr ? "تناسب بشكل طبيعي ضمن يوم المدرسة أو وقت الواجبات المنزلية" : "Fit naturally into school day or homework time"}
                isAr={isAr}
              />
              <PointCard 
                icon={<EmojiIcon emoji="🇸🇦" size={24} className="text-[#35AB4E]" />} 
                title={isAr ? "دعم اللغة العربية" : "Arabic Support"} 
                desc={isAr ? "تعليمات باللغة العربية عند الحاجة للوضوح" : "Instructions in Arabic when needed for clarity"}
                isAr={isAr}
              />
              <PointCard 
                icon={<EmojiIcon emoji="🤖" size={24} className="text-[#35AB4E]" />} 
                title={isAr ? "تعلم مدعوم بالذكاء الاصطناعي" : "AI-Powered Learning"} 
                desc={isAr ? "ردود فعل فورية وممارسة مخصصة" : "Instant feedback and personalized practice"}
                isAr={isAr}
              />
            </div>
          </div>
        </div>

        {/* Tabbed Features Section */}
        <div className="text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[#35AB4E] font-bold text-lg mb-4 block"
          >
            {isAr ? "استكشاف الميزات" : "Explore Features"}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-5xl font-black text-[#121212] mb-12"
          >
            {isAr ? "كل ما تحتاجه لإتقان اللغة الصينية" : "Everything You Need to Master Chinese"}
          </motion.h2>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-16 px-4">
            <div 
              className="relative inline-flex bg-[#F3F4F6] p-1.5 rounded-full shadow-inner w-full max-w-md border border-gray-100"
              dir={isAr ? "rtl" : "ltr"}
            >
              {/* Sliding Background */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-[#35AB4E] shadow-lg"
                initial={false}
                animate={{
                  left: isAr 
                    ? (activeTab === "students" ? "50%" : "0.375rem")
                    : (activeTab === "students" ? "0.375rem" : "50%"),
                  width: "calc(50% - 0.375rem)",
                  boxShadow: "0px 3px 0px #20672F",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />

              <button 
                onClick={() => setActiveTab("students")}
                className={`relative flex-1 flex items-center justify-center gap-3 px-4 sm:px-8 py-3.5 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 z-10 ${
                  activeTab === "students" ? "text-white" : "text-[#35AB4E] hover:brightness-110"
                }`}
              >
                <EmojiIcon emoji="🎓" size={24} className={activeTab === "students" ? "text-white" : "text-[#35AB4E]"} />
                <span className="whitespace-nowrap">{isAr ? "للطلاب" : "For Students"}</span>
              </button>
 
              <button 
                onClick={() => setActiveTab("teachers")}
                className={`relative flex-1 flex items-center justify-center gap-3 px-4 sm:px-8 py-3.5 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 z-10 ${
                  activeTab === "teachers" ? "text-white" : "text-[#35AB4E] hover:brightness-110"
                }`}
              >
                <EmojiIcon emoji="👨‍🏫" size={24} className={activeTab === "teachers" ? "text-white" : "text-[#35AB4E]"} />
                <span className="whitespace-nowrap">{isAr ? "للمعلمين" : "For Teachers"}</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="relative">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10" dir={isAr ? "rtl" : "ltr"}>
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start text-start relative z-10 h-full`}
                  >
                    {/* Icon Category Background */}
                    <div className="bg-[#E5F3E9] p-3 rounded-2xl mb-6 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>

                    <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-[#121212] mb-3 leading-tight">{f.title}</h4>
                    
                    <p className="text-[#6B7280] text-sm sm:text-base lg:text-lg font-medium mb-8 leading-relaxed">
                      {f.description}
                    </p>

                    <div className="w-full h-px bg-gray-50 mb-6" />

                    <div className={`flex items-center gap-2 text-[#35AB4E] font-bold text-sm md:text-base mt-auto`}>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                      <span>{f.footer}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function PointCard({ icon, title, desc, isAr }: { icon: React.ReactNode, title: string, desc: string, isAr: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-[#F9FAFB] p-4 sm:p-8 rounded-[48px] border border-[#F3F4F6] flex items-center gap-6 hover:shadow-md transition-all cursor-default"
    >
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
        <h4 className="font-black text-[#121212] text-lg sm:text-xl mb-1">{title}</h4>
        <p className="text-[#6B7280] font-medium text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}
