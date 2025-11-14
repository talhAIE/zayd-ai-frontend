import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navLogoPng from "@/assets/images/landingpage/nav-logo.png";
import { useLanguage } from "@/components/language-provider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { language, setLanguage } = useLanguage();

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    // { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (href: string) => {
    if (href === "#home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100; // Offset for sticky navbar

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full py-4 shadow-sm sticky top-0 bg-white z-[9999]">
      <div className="flex items-center w-full px-4">
        <div
          className="relative w-20 h-8 md:w-28 md:h-12 flex items-center cursor-pointer"
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

        {/* Centered blue background menu */}
        <ul className="hidden md:flex gap-6 bg-[#E1EEFF] px-6 py-2 rounded-full text-gray-700 font-medium mx-auto">
          {menuItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <li
                key={item.name}
                className={`cursor-pointer px-3 py-1 rounded-full transition-colors ${
                  isActive ? "bg-[#058BF4] text-white" : "hover:text-blue-800"
                }`}
                onClick={() => scrollToSection(item.href)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {/* Desktop buttons - far right */}
        <div className="hidden md:flex gap-2 items-center">
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="text-sm text-gray-700 hover:text-[#058BF4] transition-colors px-2 py-1"
          >
            العربية | English
          </button>
          <Link to="/login">
            <Button
              variant="outline"
              className="rounded-full text-black border-[#058BF4]"
            >
              Sign In
            </Button>
          </Link>
          {/* <Button className="rounded-full bg-[#058BF4]">Sign Up</Button> */}
        </div>

        {/* Mobile hamburger menu button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 shrink-0 absolute right-4"
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

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Mobile header with logo and close button */}
          <div className="flex justify-between items-center p-4 border-b">
            <div
              className="relative w-20 h-8 md:w-28 md:h-12 flex items-center cursor-pointer"
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
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={item.name}
                  className={`text-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#058BF4]"
                      : "text-gray-700 hover:text-[#058BF4]"
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
                  onClick={() => scrollToSection(item.href)}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Mobile buttons */}
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
              className="text-sm text-gray-700 hover:text-[#058BF4] transition-colors px-4 py-2 text-center"
            >
              العربية | English
            </button>
            <Link to="/login">
              <Button
                variant="outline"
                className="rounded-full text-black border-[#058BF4] w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Button>
            </Link>
            {/* <Button
              className="rounded-full bg-[#058BF4] w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
