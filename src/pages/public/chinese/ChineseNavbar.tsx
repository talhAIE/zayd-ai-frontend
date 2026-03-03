import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import navLogoPng from "@/assets/images/chinese-landingpage/zayd-mascot-orange.png";
import { useLanguage } from "@/components/language-provider";

const menuItems = [
  { name: "Home", href: "#home", isRoute: false },
  { name: "Features", href: "#features", isRoute: false },
  { name: "Pricing", href: "#pricing", isRoute: false },
  { name: "Safety", href: "#safety", isRoute: false },
];

export default function ChineseNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAr = language === "ar";

  const isChinesePath = location.pathname === "/chinese";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (href: string, isRoute: boolean = false) => {
    if (isRoute) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }
    if (href === "#home") {
      if (!isChinesePath) {
        navigate("/chinese");
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      if (!isChinesePath) {
        navigate("/chinese");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isChinesePath) {
      return;
    }

    const handleScroll = () => {
      const sections = menuItems
        .filter((item) => !item.isRoute)
        .map((item) => item.href.substring(1));
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
  }, [isChinesePath]);

  return (
    <nav className="w-full py-2 md:py-3 shadow-sm sticky top-0 bg-white z-[9999]" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center w-full px-4 relative">
        <div
          className="absolute left-4 md:relative md:left-auto w-20 h-8 md:w-28 md:h-12 flex items-center cursor-pointer z-10"
          dir="ltr"
          onClick={() => scrollToSection("#home")}
        >
          <img
            src={navLogoPng}
            alt="Zayd AI Logo"
            width={100}
            height={100}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Mobile/Tablet language toggle centered between logo and menu */}
        <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="text-sm text-gray-700 hover:text-[#35AB4E] transition-colors px-2 py-1"
          >
            {isAr ? "English | العربية" : "العربية | English"}
          </button>
        </div>

        {/* Centered green background menu */}
        <ul className="hidden lg:flex gap-6 bg-[#E4F2E7] px-6 py-2 rounded-full text-gray-700 font-medium mx-auto">
          {menuItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = item.isRoute 
              ? location.pathname === item.href
              : isChinesePath && activeSection === sectionId;
            
            if (item.isRoute) {
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`cursor-pointer px-3 py-1 rounded-full transition-colors block ${
                      isActive ? "bg-[#35AB4E] text-white" : "hover:text-[#35AB4E]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            }
            
            return (
              <li
                key={item.name}
                className={`cursor-pointer px-3 py-1 rounded-full transition-colors ${
                  isActive ? "bg-[#35AB4E] text-white" : "hover:text-[#35AB4E]"
                }`}
                onClick={() => scrollToSection(item.href, item.isRoute)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* Desktop buttons - far right */}
        <div className="hidden lg:flex gap-3 items-center">
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="text-sm text-gray-700 hover:text-[#35AB4E] transition-colors px-2 py-1"
          >
            {isAr ? "English | العربية" : "العربية | English"}
          </button>
          
          {/* Login Button - Outline Style */}
          <a href="https://nihao.waaha.ai/login">
            <Button
              variant="outline"
              className="border-2 border-gray-200 text-[#4B5563] rounded-lg px-6 py-2 h-10 font-bold hover:bg-gray-50 transition-all active:translate-y-[1px] active:border-b-0 flex items-center justify-center whitespace-nowrap"
            >
              {isAr ? "تسجيل الدخول" : "Log In"}
            </Button>
          </a>

          {/* Register Button - Premium Green Style */}
          <a href="https://nihao.waaha.ai/register">
            <Button
              className="bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center justify-center transition active:translate-y-[1px] active:border-b-0 px-6 h-10 shadow-sm whitespace-nowrap"
            >
              {isAr ? "ابدأ الآن" : "Sign Up"}
            </Button>
          </a>
        </div>

        {/* Mobile/Tablet hamburger menu button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 shrink-0 absolute right-4"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile/Tablet menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Mobile header with logo and close button */}
          <div className="flex justify-between items-center p-4 border-b relative">
            <div
              className="w-20 h-8 md:w-28 md:h-12 flex items-center cursor-pointer"
              dir="ltr"
              onClick={() => scrollToSection("#home")}
            >
              <img
                src={navLogoPng}
                alt="Zayd AI Logo"
                width={50}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="Close mobile menu"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Mobile navigation items */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-8">
            {menuItems.map((item, index) => {
              const sectionId = item.href.substring(1);
              const isActive = item.isRoute 
                ? location.pathname === item.href
                : isChinesePath && activeSection === sectionId;
              
              if (item.isRoute) {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-xl font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[#35AB4E]"
                        : "text-gray-700 hover:text-[#35AB4E]"
                    } ${
                      isMobileMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: isMobileMenuOpen
                        ? `${index * 100}ms`
                        : "0ms",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              }
              
              return (
                <button
                  key={item.name}
                  className={`text-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#35AB4E]"
                      : "text-gray-700 hover:text-[#35AB4E]"
                  } ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen
                      ? `${index * 100}ms`
                      : "0ms",
                  }}
                  onClick={() => scrollToSection(item.href, item.isRoute)}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Mobile/Tablet buttons */}
          <div
            className={`flex flex-col gap-3 p-6 border-t transition-all duration-300 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: isMobileMenuOpen ? "400ms" : "0ms",
            }}
          >
            <button
              onClick={() => {
                setLanguage(language === "ar" ? "en" : "ar");
                setIsMobileMenuOpen(false);
              }}
              className="text-sm text-gray-700 hover:text-[#35AB4E] transition-colors px-2 py-1 text-center"
            >
              {isAr ? "English | العربية" : "العربية | English"}
            </button>
            
            <div className="flex flex-col gap-3">
              {/* Login Button - Mobile */}
              <a href="https://nihao.waaha.ai/login" className="w-full">
                <Button
                  variant="outline"
                  className="border-2 border-gray-200 text-[#4B5563] rounded-lg py-6 font-extrabold hover:bg-gray-50 transition-all active:translate-y-[1px] active:border-b-0 w-full flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isAr ? "تسجيل الدخول" : "Log In"}
                </Button>
              </a>

              {/* Register Button - Mobile */}
              <a href="https://nihao.waaha.ai/register" className="w-full">
                <Button
                  className="bg-[#35AB4E] hover:bg-[#2f9c46] text-white font-extrabold rounded-lg border-b-4 border-[#20672F] flex items-center justify-center transition active:translate-y-[1px] active:border-b-0 py-6 shadow-md w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isAr ? "ابدأ الآن" : "Sign Up"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
