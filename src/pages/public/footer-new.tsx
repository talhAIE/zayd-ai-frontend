import { Mail, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import logoImg from "@/assets/images/landingpage/logo.png";
import { motion } from "framer-motion";

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  const columns = [
    {
      title: isAr ? "المنتج" : "Product",
      links: [
        { label: isAr ? "المزايا" : "Features", href: "#features" },
        { label: isAr ? "كيف يعمل؟" : "How it Works", href: "#how-it-works" },
        { label: isAr ? "الأسعار" : "Pricing", href: "#pricing" },
        { label: isAr ? "الشهادات" : "Testimonials", href: "#testimonials" },
        { label: isAr ? "الأسئلة الشائعة" : "FAQ", href: "#faq" },
      ]
    },
    {
      title: isAr ? "اللغات" : "Languages",
      links: [
        { label: isAr ? "مدرس إنجليزي" : "English Tutor", href: "#" },
        { label: isAr ? "مدرس صيني" : "Chinese Tutor", href: "#" },
        { label: isAr ? "المناهج" : "Curriculum", href: "#" },
        { label: isAr ? "تتبع التقدم" : "Progress Tracking", href: "#" },
      ]
    },
    {
      title: isAr ? "الشركة" : "Company",
      links: [
        { label: isAr ? "من نحن؟" : "About Us", href: "#" },
        { label: isAr ? "رؤية 2030" : "Vision 2030", href: "#" },
        { label: isAr ? "الوظائف" : "Careers", href: "#" },
        { label: isAr ? "اتصل بنا" : "Contact", href: "#" },
        { label: isAr ? "المدونة" : "Blog", href: "#" },
      ]
    },
    {
      title: isAr ? "الدعم" : "Support",
      links: [
        { label: isAr ? "مركز المساعدة" : "Help Center", href: "#" },
        { label: isAr ? "سياسة الخصوصية" : "Privacy Policy", href: "#" },
        { label: isAr ? "شروط الخدمة" : "Terms of Service", href: "#" },
        { label: isAr ? "سياسة الكوكيز" : "Cookie Policy", href: "#" },
      ]
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#F8FAFC] border-t border-gray-100 pt-24 pb-12" 
      dir={direction}
    >
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Logo and About Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="ZAYD Logo" className="h-10 w-auto" />
            </div>
            
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              {isAr ? (
                "نادي اللغة للدارس العصري. ممارسة الإنجليزية أو الصينية من خلال تدريب مدعوم بالذكاء الاصطناعي مصمم للطلاقة والدقة والنطق المثالي."
              ) : (
                "The Language Gym for the Modern Student. Practice English or Chinese with AI-driven training designed for fluency, accuracy, and perfect prosody."
              )}
            </p>

            <div className="flex items-center gap-4">
              {[Mail, Twitter, Instagram].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#058BF4] hover:border-blue-100 shadow-sm transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {columns.map((column, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-gray-900 font-bold text-lg">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.href} className="text-gray-500 font-medium hover:text-[#058BF4] transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Lower Footer */}
        <div className="pt-12 border-t border-gray-200/60 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Legal Links */}
          <div className="flex items-center gap-8 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">{isAr ? "الخصوصية" : "Privacy"}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{isAr ? "الشروط" : "Terms"}</a>
            <a href="#" className="hover:text-gray-900 transition-colors">{isAr ? "الكوكيز" : "Cookies"}</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400 font-medium whitespace-nowrap">
            {isAr ? (
              `© 2025 زيد أي آي. جميع الحقوق محفوظة.`
            ) : (
              `© 2025 Zayd AI. All rights reserved.`
            )}
          </p>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
            {isAr ? (
              "صنع في السعودية. تدريب قادة 2030."
            ) : (
              "Built in Saudi Arabia. Training the Leaders of 2030."
            )}
          </div>

        </div>

      </div>
    </motion.footer>
  );
}
