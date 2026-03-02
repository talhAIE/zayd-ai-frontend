import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";

export default function ChineseLanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("chinese");

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
      window.location.href = "https://nihao.waaha.ai/";
    }
  };

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full bg-[#D8EFE0] p-1.5 gap-2 border border-[#C1E2CE]">
        {/* Chinese Tab */}
        <motion.button
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "chinese"
              ? "bg-[#35AB4E] text-white shadow-md"
              : "text-[#4B5563] hover:text-[#35AB4E]"
          }`}
          onClick={() => handleTabClick("chinese")}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagChina} alt="China Flag" className="w-6 h-6 rounded-full object-cover" />
          <span>الصينية</span>
        </motion.button>

        {/* English Tab */}
        <motion.button
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "english"
              ? "bg-[#35AB4E] text-white shadow-md"
              : "text-[#4B5563] hover:text-[#35AB4E]"
          }`}
          onClick={() => handleTabClick("english")}
          whileTap={{ scale: 0.95 }}
        >
          <img src={flagUK} alt="UK Flag" className="w-6 h-6 rounded-full object-cover" />
          <span>الإنجليزية</span>
        </motion.button>
      </div>
    </div>
  );
}
