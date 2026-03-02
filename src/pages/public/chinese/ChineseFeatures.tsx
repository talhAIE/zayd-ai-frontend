import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, GraduationCap, Globe, Presentation } from "lucide-react";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";

// Image Imports
import birdImg from "@/assets/images/chinese-landingpage/bird 1.png";
import guyImg from "@/assets/images/chinese-landingpage/guy 2.png";
import booksImg from "@/assets/images/chinese-landingpage/books 2.png";

export default function ChineseFeatures() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const { language } = useLanguage();
  const isAr = language === "ar";

  const studentFeatures = [
    {
      title: isAr ? "دروس موجهة" : "Guided Lessons",
      description: isAr ? "وحدات منظمة متوافقة مع مواضيع منهج وزارة التعليم" : "Structured units aligned with Ministry of Education curriculum topics",
      footer: isAr ? "متوافق مع المنهج الدراسي" : "Curriculum Aligned",
      icon: <EmojiIcon emoji="📖" size={32} className="text-[#35AB4E]" />,
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
    <section id="features" className="py-24 px-6 bg-white font-geist overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#E5F3E9] px-6 py-2 rounded-full border border-[#D1EBD9] mb-8"
          >
            <Globe className="w-5 h-5 text-[#35AB4E]" />
            <span className="text-[#35AB4E] font-bold">
                {isAr ? "برنامج تعلم اللغة الصينية" : "Chinese Language Learning Program"}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-[#121212] mb-6 leading-tight"
          >
            {isAr ? "تعلم الصينية مع" : "Learn Chinese with"} <span className="text-[#35AB4E]">{isAr ? "ذكاء زيد الاصطناعي" : "Zayd AI"}</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6B7280] text-xl font-medium"
          >
            {isAr ? "دروس صينية مدعومة بالذكاء الاصطناعي لطلاب المدارس المتوسطة والثانوية في السعودية" : "AI-powered Chinese lessons for middle and high school students in Saudi Arabia"}
          </motion.p>
          
          {/* Top Bird Mascot - Dynamic Positioning & CSS Flip */}
          <motion.img 
            src={birdImg} 
            alt="Mascot Bird" 
            className={`absolute -top-10 ${isAr ? "-right-20" : "-left-20"} w-48 h-auto hidden xl:block`}
            initial={{ opacity: 0, x: isAr ? 50 : -50, rotate: isAr ? 10 : -10, scaleX: isAr ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0, scaleX: isAr ? 1 : -1 }}
            viewport={{ once: true }}
          />
        </div>

        {/* Features Split Section - Books vs Text Flip */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32" dir={isAr ? "rtl" : "ltr"}>
          {/* Text Points - First in DOM (Right in RTL, Left in LTR) */}
          <div className={`space-y-8 ${isAr ? "text-right" : "text-left"}`}>
            <motion.div 
              initial={{ opacity: 0, x: isAr ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <h3 className="text-4xl font-black text-[#121212]">
                {isAr ? "مصمم لطلاب السعودية" : "Designed for Saudi Students"}
              </h3>
              <div className="w-1.5 h-10 bg-[#35AB4E] rounded-full" />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, x: isAr ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B7280] text-lg leading-relaxed font-medium"
            >
              {isAr 
                ? "تم تصميم دروس زيد AI الصينية خصيصاً لطلاب المدارس المتوسطة والثانوية في السعودية. ابني مفردات ومهارات محادثة صينية حقيقية مع دعم باللغة العربية، لتبقى واثقاً بدلاً من الشعور بالضياع."
                : "Zayd AI's Chinese lessons are designed specifically for middle and high school students in Saudi Arabia. Build vocabulary and real conversation skills with Arabic support, so you stay confident instead of feeling lost."}
            </motion.p>

            <div className="space-y-4">
              <PointCard 
                icon={<EmojiIcon emoji="⚡" size={24} className="text-[#35AB4E]" />} 
                title={isAr ? "جلسات قصيرة ومركزة" : "Short, Focused Sessions"} 
                desc={isAr ? "تناسب بشكل طبيعي ضمن يوم المدرسة أو وقت الواجبات المنزلية" : "Fit naturally within the school day or homework time"}
                isAr={isAr}
              />
              <PointCard 
                icon={<EmojiIcon emoji="🌍" size={24} className="text-[#35AB4E]" />} 
                title={isAr ? "دعم اللغة العربية" : "Arabic Support"} 
                desc={isAr ? "تعليمات باللغة العربية عند الحاجة للوضوح" : "Arabic instructions when needed for clarity"}
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

          {/* Books Image - Second in DOM (Left in RTL, Right in LTR) */}
          <motion.div 
            initial={{ opacity: 0, x: isAr ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src={booksImg} alt="Learning Books" className="w-full h-auto max-w-[400px] mx-auto flip-in-en" />
          </motion.div>
        </div>

        {/* Tabbed Features Section */}
        <div className="text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#35AB4E] font-bold text-lg mb-4 block"
          >
            {isAr ? "استكشاف الميزات" : "Explore Features"}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-[#121212] mb-12"
          >
            {isAr ? "كل ما تحتاجه لإتقان اللغة الصينية" : "Everything You Need to Master Chinese"}
          </motion.h2>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-[#F3F4F6] p-1.5 rounded-full shadow-inner">
              <button 
                onClick={() => setActiveTab("students")}
                className={`flex items-center gap-2 px-10 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
                  activeTab === "students" 
                    ? "bg-[#35AB4E] text-white shadow-lg" 
                    : "text-[#6B7280] hover:text-[#35AB4E]"
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${activeTab === "students" ? "text-white" : "text-[#6B7280]"}`} />
                {isAr ? "للطلاب" : "For Students"}
              </button>
              <button 
                onClick={() => setActiveTab("teachers")}
                className={`flex items-center gap-2 px-10 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
                  activeTab === "teachers" 
                    ? "bg-[#35AB4E] text-white shadow-lg" 
                    : "text-[#6B7280] hover:text-[#35AB4E]"
                }`}
              >
                <Presentation className={`w-5 h-5 ${activeTab === "teachers" ? "text-white" : "text-[#6B7280]"}`} />
                {isAr ? "للمعلمين" : "For Teachers"}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="relative">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 relative z-10" dir={isAr ? "rtl" : "ltr"}>
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white p-8 rounded-[48px] border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all group flex flex-col items-start text-start`}
                  >
                    {/* Header: Title + Icon row */}
                    <div className="flex items-center gap-4 mb-4">
                      <h4 className="text-xl font-black text-[#121212] leading-none">{f.title}</h4>
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {f.icon}
                      </div>
                    </div>

                    <p className="text-[#6B7280] text-sm font-medium mb-6 leading-relaxed">
                      {f.description}
                    </p>

                    <div className={`flex items-center justify-between w-full mt-auto text-[#35AB4E] font-bold text-sm`}>
                      <span>{f.footer}</span>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Guy Mascot - Dynamic Positioning & CSS Flip */}
            <motion.img 
              src={guyImg} 
              alt="Mascot Guy" 
              className={`absolute bottom-0 ${isAr ? "-left-40" : "-right-40"} w-[280px] pointer-events-none hidden xl:block`}
              initial={{ opacity: 0, x: isAr ? -50 : 50, scaleX: isAr ? 1 : -1 }}
              whileInView={{ opacity: 1, x: 0, scaleX: isAr ? 1 : -1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function PointCard({ icon, title, desc, isAr }: { icon: React.ReactNode, title: string, desc: string, isAr: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-[#F9FAFB] p-8 rounded-[48px] border border-[#F3F4F6] flex items-center gap-6 hover:shadow-md transition-all cursor-default"
    >
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
        <h4 className="font-black text-[#121212] text-xl mb-1">{title}</h4>
        <p className="text-[#6B7280] font-medium text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}
