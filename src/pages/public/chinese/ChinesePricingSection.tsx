import { motion } from "framer-motion";
import { GraduationCap, School, CheckCircle2 } from "lucide-react";
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
      icon: <School className="w-10 h-10 text-[#058BF4]" />,
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
      icon: <GraduationCap className="w-10 h-10 text-[#058BF4]" />,
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
    <section className="py-24 px-6 bg-white overflow-hidden" dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Top Mascot & Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <motion.img
            src={birdImg}
            alt="Zayd AI Mascot"
            className="w-72 h-auto mb-8"
            initial={{ opacity: 0, scaleX: isAr ? 0.8 : -0.8, scaleY: 0.8 }}
            whileInView={{ opacity: 1, scaleX: isAr ? 1 : -1, scaleY: 1 }}
            viewport={{ once: true }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#E5F3E9] text-[#35AB4E] px-6 py-2 rounded-full text-sm font-bold mb-6"
          >
            {isAr ? "أسعار مرنة" : "Flexible Pricing"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-[#121212] mb-8"
          >
            {isAr ? "خطط للطلاب والمدارس" : "Plans for Students & Schools"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#6B7280] text-xl font-medium max-w-3xl leading-relaxed"
          >
            {isAr 
              ? "تقدم Zayd AI خططاً مرنة للمتعلمين الأفراد ونشر المدارس بالكامل. تشمل جميع الخطط الوصول إلى منصتنا الآمنة المعتمدة من SADAIA واستضافة محلية في السعودية."
              : "Zayd AI offers flexible plans for individual learners and full school deployments. All plans include access to our secure SADAIA-certified platform and local Saudi hosting."}
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isAr ? (i === 0 ? 50 : -50) : (i === 0 ? -50 : 50) }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-12 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-start text-start"
            >
              {/* Logically Aligned Header: Title + Icon */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-4xl font-black text-[#121212] leading-none">{plan.title}</h3>
                <div className="w-10 h-10 flex items-center justify-center">
                  {plan.icon}
                </div>
              </div>
              
              <p className="text-[#6B7280] text-lg font-medium mb-10 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-4 w-full px-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`flex items-center justify-between w-full py-1`}>
                    <p className="text-[#121212] font-semibold text-lg leading-snug">
                      {feature}
                    </p>
                    <CheckCircle2 className="w-6 h-6 text-[#35AB4E] shrink-0" />
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
          viewport={{ once: true }}
          className="bg-[#E5F3E9] rounded-[48px] p-10 md:p-20 relative overflow-hidden"
        >
          {/* Content Wrapper - Padded to avoid mascot overlap */}
          <div className={`relative z-10 ${isAr ? "md:mr-auto md:ml-0 text-center md:text-right md:pr-64" : "md:ml-auto md:mr-0 text-center md:text-left md:pl-64"}`}>
            <h3 className="text-3xl md:text-4xl font-black text-[#121212] mb-4">
              {isAr ? "هل أنت مستعد للبدء؟" : "Are you ready to start?"}
            </h3>
            <p className="text-[#35AB4E] text-lg md:text-xl font-bold mb-10 max-w-lg mx-auto md:mx-0">
              {isAr 
                ? "شارك حجم مدرستك واحتياجاتك اللغوية، وسنوصي بأفضل خطة لك."
                : "Share your school size and language needs, and we'll recommend the best plan for you."}
            </p>
            <button className="bg-[#35AB4E] text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-[#2D8E41] transition-all transform hover:scale-105 shadow-lg shadow-[#35AB4E]/20">
              {isAr ? "اتصل بنا للحصول على الأسعار" : "Contact us for pricing"}
            </button>
          </div>

          {/* Absolute Mascot - Centered on edge */}
          <motion.img
            src={birdSide}
            alt="Owl Mascot"
            className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "right-0" : "left-0"} w-32 md:w-48 h-auto object-contain pointer-events-none`}
            initial={{ opacity: 0, x: isAr ? 50 : -50, y: "-50%", scaleX: isAr ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0, y: "-50%", scaleX: isAr ? 1 : -1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
