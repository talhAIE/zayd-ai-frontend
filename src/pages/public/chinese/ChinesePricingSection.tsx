import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";
import birdImg from "@/assets/images/chinese-landingpage/birdy-wings-up.png";
import birdSide from "@/assets/images/chinese-landingpage/bird-side.png";

export default function ChinesePricingSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const plans = [
    {
      type: "school",
      title: isAr ? "للمدارس" : "For Schools",
      description: isAr ? "نشر كامل مع أدوات إدارة وتحليلات" : "Full deployment with management and analytics tools",
      icon: <EmojiIcon emoji="🏫" size={32} className="text-[#35AB4E]" />,
      features: isAr ? [
        "جميع ميزات الطلاب مشمولة",
        "لوحات تحكم للمعلمين والإدارة مع تحليلات",
        "دعم أولوية لشركاء التعليم"
      ] : [
        "All student features included",
        "Dashboards for teachers and admins with analytics",
        "Priority support for education partners"
      ],
    },
    {
      type: "student",
      title: isAr ? "للطلاب" : "For Students",
      description: isAr ? "متعلمين فرديين مستعدين لإتقان اللغة الإنجليزية أو الصينية" : "Individual learners ready to master English or Chinese",
      icon: <EmojiIcon emoji="🎓" size={32} className="text-[#35AB4E]" />,
      features: isAr ? [
        "الوصول إلى برامج اللغة الإنجليزية و/أو الصينية",
        "لوحة تحكم شخصية مع إنجازات ومكافآت",
        "شهادات وشارات للمعالم الهامة"
      ] : [
        "Access to English and/or Chinese language programs",
        "Personal dashboard with achievements and rewards",
        "Certificates and badges for key milestones"
      ],
    }
  ];

  return (
    <section id="pricing" className={`py-12 px-6 bg-white overflow-hidden ${isAr ? 'font-almarai' : 'font-nunito'} relative overflow-x-hidden`} dir={dir}>
      <div className="max-w-[1440px] mx-auto">
        {/* Top Mascot & Header */}
        <div className="flex flex-col items-center text-center mb-10 relative">
          <motion.img
            src={birdImg}
            alt="Zayd AI Mascot"
            className="w-72 h-auto mb-8"
            initial={{ opacity: 0, scaleX: isAr ? 0.8 : -0.8, scaleY: 0.8 }}
            whileInView={{ opacity: 1, scaleX: isAr ? 1 : -1, scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[#E5F3E9] text-[#35AB4E] px-6 py-2 rounded-full text-sm font-bold mb-6"
          >
            {isAr ? "أسعار مرنة" : "Flexible Pricing"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#121212] mb-8"
          >
            {isAr ? "خطط للطلاب والمدارس" : "Plans for Students & Schools"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-[#6B7280] text-base sm:text-lg md:text-xl font-medium max-w-3xl leading-relaxed"
          >
            {isAr 
              ? "تقدم Zayd AI خططاً مرنة للمتعلمين الأفراد ونشر المدارس بالكامل. تشمل جميع الخطط الوصول إلى منصتنا الآمنة المعتمدة من SADAIA واستضافة محلية في السعودية."
              : "Zayd AI offers flexible plans for individual learners and full school deployments. All plans include access to our secure SADAIA-certified platform and local Saudi hosting."}
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isAr ? (i === 0 ? 50 : -50) : (i === 0 ? -50 : 50) }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-10 md:p-12 rounded-[24px] md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-start text-start"
            >
              {/* Logically Aligned Header: Title + Icon */}
              <div className="flex items-center gap-3 md:gap-4 mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  {plan.icon}
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-[#121212] leading-none">{plan.title}</h3>
              </div>
              
              <p className="text-[#6B7280] text-base md:text-lg font-medium mb-6 md:mb-10 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-3 md:space-y-4 w-full px-2 md:px-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`flex items-center justify-between w-full py-1`}>
                    <p className="text-[#121212] font-semibold text-sm md:text-lg leading-snug">
                      {feature}
                    </p>
                    <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-[#35AB4E] shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-[#E5F3E9] rounded-[48px] p-10 lg:p-20 relative overflow-hidden"
        >
          {/* Content Wrapper - Padded to avoid mascot overlap */}
          <div className="relative z-10 w-full flex justify-center">
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#121212] mb-4">
                {isAr ? "هل أنت مستعد للبدء؟" : "Are you ready to start?"}
              </h3>
              <p className="text-[#35AB4E] text-base sm:text-lg lg:text-xl font-bold mb-6 lg:mb-8">
                {isAr 
                  ? "شارك حجم مدرستك واحتياجاتك اللغوية، وسنوصي بأفضل خطة لك."
                  : "Share your school size and language needs, and we'll recommend the best plan for you."}
              </p>
              <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                <button 
                  className="text-white px-6 lg:px-10 py-3 lg:py-5 font-black flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 w-full lg:w-auto text-sm sm:text-base lg:text-lg"
                  style={{
                    background: "#35AB4E",
                    boxShadow: "0px 3px 0px #20672F",
                    borderRadius: "12px",
                  }}
                >
                  {isAr ? "اتصل بنا للحصول على الأسعار" : "Contact us for pricing"}
                </button>
              </div>
            </div>
          </div>

          {/* Absolute Mascot - Centered on edge */}
          <motion.img
            src={birdSide}
            alt="Owl Mascot"
            className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${isAr ? "right-[calc(50%-720px-80px)]" : "left-[calc(50%-720px-80px)]"} w-[12vw] max-w-[200px] h-auto object-contain pointer-events-none z-0 transition-all duration-500`}
            initial={{ opacity: 0, x: isAr ? 50 : -50, y: "-50%", scaleX: isAr ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0, y: "-50%", scaleX: isAr ? 1 : -1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.6,
              type: "spring",
              stiffness: 100,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
