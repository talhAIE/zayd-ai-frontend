import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import navLogoPng from "@/assets/images/chinese-landingpage/zayd-mascot-orange.png";
import { useLanguage } from "@/components/language-provider";

const menuItems = [
  { name: "الرئيسية", href: "#home" },
  { name: "الميزات", href: "#features" },
  { name: "كيف يعمل", href: "#how-it-works" },
  { name: "الشهادات", href: "#testimonials" },
  { name: "التسعير", href: "#pricing" },
  { name: "الأسئلة الشائعة", href: "#faq" },
];

export default function ChineseNavbar() {
  const [activeSection, setActiveSection] = useState("home");
  const { language, setLanguage } = useLanguage();
  const isAr = language === "ar";

  const localizedMenuItems = menuItems.map(item => ({
    ...item,
    name: language === "ar" ? item.name : 
          item.href === "#home" ? "Home" :
          item.href === "#features" ? "Features" :
          item.href === "#how-it-works" ? "How it Works" :
          item.href === "#testimonials" ? "Testimonials" :
          item.href === "#pricing" ? "Pricing" :
          item.href === "#faq" ? "FAQ" : item.name
  }));

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full py-6 px-10 sticky top-0 bg-white z-[9999] flex items-center justify-between font-geist" dir={isAr ? "rtl" : "ltr"}>
      {/* Logo Section */}
      <div 
        className={`flex items-center cursor-pointer ${isAr ? "ml-auto" : "mr-auto lg:mr-0 lg:ml-0"}`} 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src={navLogoPng} alt="Zayd AI Logo" className="object-contain" />
      </div>

      {/* Centered Pill Menu - Dynamic dir */}
      <div className="hidden lg:flex items-center bg-[#E5F3E9] p-1.5 rounded-full border border-[#D1EBD9] mx-auto">
        <ul className="flex items-center gap-2" dir={isAr ? "rtl" : "ltr"}>
          {localizedMenuItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <li
                key={item.href}
                className={`px-6 py-2 rounded-full cursor-pointer text-sm font-bold transition-all duration-300 ${
                  isActive ? "bg-[#35AB4E] text-white shadow-sm" : "text-[#4B5563] hover:text-[#35AB4E]"
                }`}
                onClick={() => scrollToSection(item.href)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Side: Toggle & Auth Buttons */}
      <div className={`flex items-center gap-6 ${isAr ? "mr-auto lg:mr-0 lg:ml-0" : "ml-auto lg:ml-0 lg:mr-0"}`}>
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="text-sm font-bold text-[#4B5563] hover:text-[#35AB4E] transition-colors"
        >
          {isAr ? "English | العربية" : "العربية | English"}
        </button>

        <div className="flex items-center gap-4">
          <Link to="/signup">
            <Button variant="outline" className="rounded-xl border border-gray-400 px-7 py-6 text-[16px] font-bold text-[#1F2937] hover:bg-gray-50 bg-white">
              {isAr ? "سجل الآن" : "Sign Up"}
            </Button>
          </Link>
          <Link to="/login">
            <Button className="rounded-xl bg-[#35AB4E] hover:bg-[#2E9643] px-7 py-6 text-[16px] font-bold text-white flex items-center gap-2 group shadow-sm transition-all active:scale-95">
              {isAr ? "تسجيل الدخول" : "Sign In"}
              <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${isAr ? "rotate-180 transform group-hover:translate-x-[-2px]" : "transform group-hover:translate-x-[2px]"} transition-transform`}
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
