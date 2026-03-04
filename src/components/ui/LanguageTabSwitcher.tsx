import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";
import { useLanguage } from "@/components/language-provider";

export default function LanguageTabSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("english");
  const isAr = language === "ar";
  
  // Dynamic colors based on current page
  const isChinesePage = location.pathname === "/chinese";
  
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
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center mt-6 mb-8">
      <div className="inline-flex rounded-full bg-[#F3F4F6] p-1 border border-gray-100 shadow-sm">
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "english"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:brightness-110" : "text-blue-500 hover:brightness-110"
          }`}
          style={{
            background: activeTab === "english" ? activeGradient : "transparent",
            boxShadow: activeTab === "english" 
              ? isChinesePage ? "0px 3px 0px #20672F" : "0px 3px 0px #0472C6"
              : "none"
          }}
          onClick={() => handleTabClick("english")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagUK} alt="UK Flag" className="w-5 h-5" />
          {isAr ? "الإنجليزية" : "English"}
        </motion.button>
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "chinese"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:brightness-110" : "text-blue-500 hover:brightness-110"
          }`}
          style={{
            background: activeTab === "chinese" ? activeGradient : "transparent",
            boxShadow: activeTab === "chinese" 
              ? isChinesePage ? "0px 3px 0px #20672F" : "0px 3px 0px #0472C6"
              : "none"
          }}
          onClick={() => handleTabClick("chinese")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagChina} alt="China Flag" className="w-5 h-5" />
          {isAr ? "الصينية" : "Chinese"}
        </motion.button>
      </div>
    </div>
  );
}
