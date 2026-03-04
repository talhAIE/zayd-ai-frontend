import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";

export default function ChineseSafetySection() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const safetyCards = [
    {
      title: isAr ? "خوادم محلية سعودية" : "Saudi Local Servers",
      description: isAr 
        ? "يتم استضافة جميع بيانات المنصة على خوادم آمنة داخل المملكة العربية السعودية، مما يقلل من زمن الاستجابة ويتماشى مع السياسات الوطنية بشأن سيادة البيانات."
        : "All platform data is hosted on secure servers within Saudi Arabia, reducing latency and aligning with national data sovereignty policies.",
      icon: <EmojiIcon emoji="🇸🇦" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "ذكاء اصطناعي معتمد من SADAIA" : "SADAIA Certified AI",
      description: isAr 
        ? "يستخدم زيد AI تكنولوجيا الذكاء الاصطناعي المعتمدة من SADAIA، مما يمنح المدارس والعائلات الثقة في كيفية عمل النظام وكيفية التعامل مع البيانات."
        : "Zayd AI uses SADAIA-certified AI technology, giving schools and families confidence in how the system works and how data is handled.",
      icon: <EmojiIcon emoji="✅" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "مصمم لدعم منهج وزارة التعليم" : "Designed for MoE Curriculum",
      description: isAr 
        ? "تم تصميم المحتوى والمواضيع وأنماط التفاعل لدعم أهداف منهج وزارة التعليم واستخدامه في الفصول الدراسية للطلاب السعوديين."
        : "Content, topics, and interaction patterns are designed to support Ministry of Education curriculum goals and classroom use for Saudi students.",
      icon: <EmojiIcon emoji="📚" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
  ];

  const bottomCards = [
    {
      title: isAr ? "تفاعلات ذكاء اصطناعي آمنة للأطفال" : "Safe AI Interactions for Children",
      points: isAr ? [
        "مرشحات محتوى صارمة وحواجز أمان",
        "لا يوجد وصول إلى الويب المفتوح للطلاب داخل التطبيق",
        "مواضيع ولغة مناسبة للعمر، مناسبة للاستخدام في المدرسة والمنزل"
      ] : [
        "Strict content filters and safety guardrails",
        "No open web access for students within the application",
        "Age-appropriate topics and language, suitable for school and home use"
      ],
      icon: <EmojiIcon emoji="🔒" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
    {
      title: isAr ? "تحكم على مستوى المدرسة" : "School-Level Control",
      description: isAr 
        ? "يمكن للمسؤولين إدارة الفصول الدراسية، وإضافة أو إزالة الطلاب، والتحكم في الميزات المفعلة، مما يضمن توافق المنصة مع سياسات كل مدرسة."
        : "Administrators can manage classrooms, add/remove students, and control feature access, ensuring the platform aligns with school policies.",
      icon: <EmojiIcon emoji="⚙️" size={32} className="text-[#35AB4E]" />,
      iconBg: "bg-[#E5F3E9]",
    },
  ];

  return (
    <section id="safety" className={`py-12 px-6 bg-white ${isAr ? 'font-almarai' : 'font-nunito'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl sm:text-3xl lg:text-[clamp(1.5rem,3.5vw,2.5rem)] font-black text-[#121212] mb-8 leading-tight max-w-4xl mx-auto"
          >
            {isAr ? "السلامة والامتثال والاستضافة المحلية في المملكة العربية السعودية" : "Safety, Compliance, and Local Hosting in Saudi Arabia"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-[#6B7280] text-base sm:text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {isAr 
              ? "تم بناء زيد AI من الألف إلى الياء لتلبية احتياجات التعليم السعودي. يعمل كل من زيد AI باللغة الإنجليزية وزيد AI باللغة الصينية على تكنولوجيا الذكاء الاصطناعي المعتمدة من SADAIA ويتبع معايير صارمة للسلامة وحماية البيانات."
              : "Zayd AI was built from the ground up for Saudi Education. Both Zayd AI English and Zayd AI Chinese run on SADAIA-certified AI technology with strict safety and data protection standards."}
          </motion.p>
        </div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {safetyCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-start"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#121212] leading-none">{card.title}</h3>
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] font-medium leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {bottomCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-start"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#121212] leading-none">{card.title}</h3>
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
              </div>
              {card.points ? (
                <ul className="space-y-3">
                  {card.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#35AB4E] shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base lg:text-lg text-[#374151] leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] font-medium leading-relaxed">
                  {card.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
