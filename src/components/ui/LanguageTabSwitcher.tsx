import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";
import { useLanguage } from "@/components/language-provider";

export default function LanguageTabSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("english");
  const isAr = language === "ar";
  
  // Dynamic colors based on current page
  const isChinesePage = location.pathname === "/chinese";
  const shadowColor = isChinesePage ? "rgba(53, 171, 78, 0.4)" : "rgba(5, 139, 244, 0.4)";
  
  // Dynamic gradient based on page
  const activeGradient = isChinesePage 
    ? "linear-gradient(90deg, #4CAF50 0%, #35AB4E 48.56%, #4CAF50 80%)"
    : "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)";

  useEffect(() => {
    // Sync with current route - this determines the active tab
    if (location.pathname === "/chinese") {
      setActiveTab("chinese");
    } else {
      setActiveTab("english");
    }
  }, [location.pathname]);

  const handleTabClick = (tab: "english" | "chinese") => {
    if (tab === "chinese") {
      navigate("/chinese");
      setLanguage("en"); // Set to English for Chinese landing page
    } else {
      navigate("/");
      setLanguage("en"); // Set to English for main landing page
    }
  };

  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="inline-flex rounded-full bg-white/10 backdrop-blur-sm p-1 shadow-lg" 
           style={{ boxShadow: `0 4px 30px ${shadowColor}` }}>
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-medium transition-all duration-300 ${
            activeTab === "english"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:text-green-700" : "text-blue-500 hover:text-blue-700"
          }`}
          style={{
            background: activeTab === "english" ? activeGradient : "transparent"
          }}
          onClick={() => handleTabClick("english")}
          whileHover={{ 
            scale: activeTab === "english" ? 1.05 : 1.02,
            boxShadow: activeTab === "english" 
              ? `0 0 20px ${shadowColor}` 
              : "none"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagUK} alt="UK Flag" className="w-5 h-5" />
          {isAr ? "الإنجليزية" : "English"}
        </motion.button>
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-medium transition-all duration-300 ${
            activeTab === "chinese"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:text-green-700" : "text-blue-500 hover:text-blue-700"
          }`}
          style={{
            background: activeTab === "chinese" ? activeGradient : "transparent"
          }}
          onClick={() => handleTabClick("chinese")}
          whileHover={{ 
            scale: activeTab === "chinese" ? 1.05 : 1.02,
            boxShadow: activeTab === "chinese" 
              ? `0 0 20px ${shadowColor}` 
              : "none"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagChina} alt="China Flag" className="w-5 h-5" />
          {isAr ? "الصينية" : "Chinese"}
        </motion.button>
      </div>
    </div>
  );
}
