import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";

export default function LanguageTabSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("english");

  useEffect(() => {
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
      <div className="inline-flex rounded-full bg-white/10 backdrop-blur-sm p-1 shadow-lg shadow-[#058BF4]/20">
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-medium transition-all duration-300 ${
            activeTab === "english"
              ? "text-white"
              : "text-blue-500 hover:text-blue-700"
          }`}
          style={{
            background: activeTab === "english"
              ? "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)"
              : "transparent"
          }}
          onClick={() => handleTabClick("english")}
          whileHover={{ 
            scale: activeTab === "english" ? 1.05 : 1.02,
            boxShadow: activeTab === "english" 
              ? "0 0 20px rgba(5, 139, 244, 0.4)" 
              : "none"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagUK} alt="UK Flag" className="w-5 h-5" />
          English
        </motion.button>
        <motion.button
          className={`flex items-center gap-3 px-8 py-3 rounded-full text-base font-medium transition-all duration-300 ${
            activeTab === "chinese"
              ? "text-white"
              : "text-blue-500 hover:text-blue-700"
          }`}
          style={{
            background: activeTab === "chinese"
              ? "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)"
              : "transparent"
          }}
          onClick={() => handleTabClick("chinese")}
          whileHover={{ 
            scale: activeTab === "chinese" ? 1.05 : 1.02,
            boxShadow: activeTab === "chinese" 
              ? "0 0 20px rgba(5, 139, 244, 0.4)" 
              : "none"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagChina} alt="China Flag" className="w-5 h-5" />
          Chinese
        </motion.button>
      </div>
    </div>
  );
}
