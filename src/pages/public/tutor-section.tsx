import { motion } from "framer-motion";
import { useState } from "react";
import birdWithBook from "@/assets/images/landingpage/bird-with-book.png";
import parrotMascot from "@/assets/images/landingpage/parrot.png"; // Assuming parrot for chinese based on previous assets
import { useLanguage } from "@/components/language-provider";
import EmojiIcon from "@/components/ui/emoji-icon";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";

const tutors = {
  english: {
    specialty: "English Specialist",
    arabicSpecialty: "متخصص الإنجليزية",
    image: birdWithBook,
    features: [
      {
        emoji: "🎓",
        title: "The Persona",
        arabicTitle: "الشخصية",
        description: "Meet Zayd, your mentor in the dark blue thobe.",
        arabicDescription: "قابل زيد، مرشدك بالثوب الأزرق الداكن.",
      },
      {
        emoji: "🎯",
        title: "The Focus",
        arabicTitle: "التركيز",
        description: "Academic mastery of the Saudi Curriculum (Mega Goal / Super goal).",
        arabicDescription: "إتقان أكاديمي للمنهج السعودي (Mega Goal / Super Goal).",
      },
      {
        emoji: "💪",
        title: "The Workout",
        arabicTitle: "التدريب",
        description: "High-frequency practice that turns school lessons into real-world confidence.",
        arabicDescription: "ممارسة مكثفة تحول الدروس المدرسية إلى ثقة في العالم الحقيقي.",
      },
    ],
  },
  chinese: {
    specialty: "Chinese Specialist",
    arabicSpecialty: "متخصص الصينية",
    image: parrotMascot,
    features: [
      {
        emoji: "🏮",
        title: "Cultural Context",
        arabicTitle: "السياق الثقافي",
        description: "Experience Chinese as it's spoken in real social contexts.",
        arabicDescription: "اختبر اللغة الصينية كما يتم التحدث بها في السياقات الاجتماعية الحقيقية.",
      },
      {
        emoji: "🥢",
        title: "Practical Usage",
        arabicTitle: "الاستخدام العملي",
        description: "Master essential phrases and sentence structures for daily life.",
        arabicDescription: "أتقن العبارات الأساسية وتراكيب الجمل للحياة اليومية.",
      },
      {
        emoji: "🏯",
        title: "Traditional Roots",
        arabicTitle: "الجذور التقليدية",
        description: "Understand the logic and history behind the characters.",
        arabicDescription: "افهم المنطق والتاريخ خلف الرموز.",
      },
    ],
  },
};

export default function TutorSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [activeTutor, setActiveTutor] = useState<"english" | "chinese">("english");

  const tutor = tutors[activeTutor];

  return (
    <section id="tutors" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - Centered */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[13px] font-bold mb-6"
          >
            {isAr ? "المعلمون" : "The Tutors"}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold text-[#111827] mb-6 tracking-tight"
          >
            {isAr ? "مدربو اللغة العاملون بالذكاء الاصطناعي" : "Your AI Language Coaches"}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {isAr ? (
              "معلمان متخصصان، كل منهما مصمم لإتقان مجاله. اختر مدربك وابدأ التدريب."
            ) : (
              "Two specialized tutors, each designed to master their domain. Choose your coach and start training."
            )}
          </motion.p>
        </div>

        {/* Tutor Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-50/80 p-1.5 rounded-full flex items-center gap-1 border border-gray-100 shadow-sm">
            <button
              onClick={() => setActiveTutor("english")}
              className={`px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                activeTutor === "english" 
                ? "bg-gradient-to-r from-[#76ABF8] to-[#058BF4] text-white shadow-md" 
                : "text-blue-500 hover:bg-gray-100"
              }`}
            >
              <img src={flagUK} alt="UK" className="w-5 h-5" />
              {isAr ? "الإنجليزية" : "English"}
            </button>
            <button
              onClick={() => setActiveTutor("chinese")}
              className={`px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                activeTutor === "chinese" 
                ? "bg-gradient-to-r from-[#76ABF8] to-[#058BF4] text-white shadow-md" 
                : "text-blue-500 hover:bg-gray-100"
              }`}
            >
              <img src={flagChina} alt="China" className="w-5 h-5" />
              {isAr ? "الصينية" : "Chinese"}
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div 
          key={activeTutor}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-[48px] border border-gray-100 bg-white p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Left Side: Mascot + Specialty Tag */}
          <div className="flex-1 flex flex-col items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/20 blur-[80px] rounded-full scale-125 pointer-events-none" />
              <img
                src={tutor.image}
                alt={activeTutor}
                className="relative w-full max-w-[400px] h-auto object-contain"
              />
            </div>
            
            {/* Specialty Tag Footer */}
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gray-50 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
              <img src={activeTutor === "english" ? flagUK : flagChina} alt="Flag" className="w-5 h-5" />
              <span className="text-sm font-bold text-gray-800">
                {isAr ? tutor.arabicSpecialty : tutor.specialty}
              </span>
            </div>
          </div>

          {/* Right Side: Feature List */}
          <div className="flex-1 space-y-12">
            {tutor.features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-6 group"
              >
                <div className="p-4 rounded-2xl bg-[#E0F2FE]/50 shadow-sm flex items-center justify-center">
                  <EmojiIcon emoji={feature.emoji} size={28} />
                </div>
                <div>
                  <h3 className="text-[22px] font-extrabold text-gray-900 mb-2 leading-tight">
                    {isAr ? feature.arabicTitle : feature.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                    {isAr ? feature.arabicDescription : feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
