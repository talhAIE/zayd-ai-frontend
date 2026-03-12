import { motion } from "framer-motion";
import stopwatchImg from "@/assets/images/landingpage/clock.png";
import { useLanguage } from "@/components/language-provider";
import EmojiIcon from "@/components/ui/emoji-icon";

const features = [
  {
    emoji: "🔔",
    title: "Stay Accountable",
    arabicTitle: "ابقَ منضبطاً",
    description: "Get reminders and stay on track with your goals.",
    arabicDescription: "احصل على تذكيرات وحافظ على مسار أهدافك.",
  },
  {
    emoji: "💪",
    title: "Build the Habit",
    arabicTitle: "ابنِ العادة",
    description: "Track your weekly 60-minute goal on your dashboard.",
    arabicDescription: "تتبع هدفك الأسبوعي المكون من 60 دقيقة في لوحتك.",
  },
  {
    emoji: "📈",
    title: "See the Gains",
    arabicTitle: "شاهد التقدم",
    description: "Visualize your improvement and celebrate your wins.",
    arabicDescription: "شاهد تحسنك واحتفل بنجاحاتك.",
  },
];

export default function ClockworkSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  return (
    <section id="clockwork" className="py-24 bg-white relative overflow-hidden" dir={direction}>
      <div className="max-w-7xl mx-auto px-4">
        
            {/* Header - Centered */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center px-6 py-2 rounded-full border border-gray-100 bg-white text-gray-900 text-sm font-bold mb-8 shadow-sm"
          >
            {isAr ? "الطلاقة" : "Fluency"}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]"
          >
            {isAr ? "تحدي الـ 60 دقيقة" : "The 60-Minute Challenge"}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {isAr ? (
              "هل يمكنك منح مستقبلك ساعة واحدة في الأسبوع؟"
            ) : (
              "Can you give your future one hour a week?"
            )}
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-5xl mx-auto">
          
          {/* Stopwatch Image Side */}
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/20 blur-[100px] rounded-full scale-125" />
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src={stopwatchImg}
                alt="60 Minute Challenge Stopwatch"
                className="relative w-full max-w-[450px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Features Side */}
          <div className="flex-1 flex flex-col gap-10">
            {features.map((feature, idx) => {
              const isCenter = idx === 1;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + idx * 0.1, ease: "circOut" }}
                  className={`flex items-start gap-6 group transition-all duration-300 ${
                    !isCenter ? (isAr ? "mr-12" : "ml-12") : "scale-110"
                  }`}
                >
                  <div 
                    className={`rounded-full shadow-lg shadow-blue-50/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${
                      isCenter ? "p-5" : "p-4"
                    }`}
                    style={{ background: "linear-gradient(135deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
                  >
                    <EmojiIcon emoji={feature.emoji} size={isCenter ? 32 : 28} className="text-white" />
                  </div>
                  <div className={isCenter ? "mt-1" : ""}>
                    <h3 className={`${isCenter ? "text-3xl" : "text-2xl"} font-extrabold text-gray-900 mb-2 leading-tight`}>
                      {isAr ? feature.arabicTitle : feature.title}
                    </h3>
                    <p className={`text-gray-500 font-medium leading-relaxed max-w-sm ${isCenter ? "text-lg" : "text-base"}`}>
                      {isAr ? feature.arabicDescription : feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
