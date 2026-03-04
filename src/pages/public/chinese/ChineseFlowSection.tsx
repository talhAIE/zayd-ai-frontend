import repairImg from "@/assets/images/landingpage/repair.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";

export default function ChineseFlowSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  
  return (
    <section id="how-it-works" className={`bg-white sm:py-24 py-12 px-6 ${isAr ? 'font-almarai' : 'font-nunito'}`}>
      <div className="container mx-auto max-w-6xl">
        {/* Top Section with Bird Illustration and Pill Button */}
        <motion.div
          className="flex flex-col gap-4 items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Pill Button */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="border border-gray-300 text-black px-6 py-2 rounded-full text-sm font-medium">
              {isAr ? "كيف يعمل" : "How it works"}
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-[#666666] mb-4">
              {isAr ? "كيف تعمل المنصة؟" : "So, how does it work?"}
            </h2>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-12 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          {/* Bird SVG above the progress bar */}
          <motion.div
            className={`absolute -top-[310%] z-10 hidden md:block ${isAr ? "-right-4" : "-left-4"}`}
            initial={{ opacity: 0, x: isAr ? 50 : -50, scale: 0.5 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
          >
            <img
              src={repairImg}
              alt="Bird illustration"
              width={160}
              height={160}
              className={`w-40 h-40 ${isAr ? "" : "flip-in-en"}`}
            />
          </motion.div>

          <div className="relative">
            {/* Gradient Background Bar with fading ends */}
            <motion.div
              className="h-12 bg-gradient-to-r from-transparent via-[#35AB4E] to-transparent rounded-full opacity-30"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 1.0 }}
              style={{ transformOrigin: isAr ? "right" : "left" }}
            ></motion.div>

            {/* Numbered Circles */}
            <motion.div
              className="absolute top-2 px-8 left-0 w-full flex justify-between"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {[1, 2, 3, 4].map((number) => (
                <motion.div
                  key={number}
                  className="w-8 h-8 border border-slate-300 bg-white rounded-full flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.4 + (isAr ? (5-number) : number) * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#35AB4E",
                    color: "white",
                    borderColor: "#35AB4E",
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.span
                    className="text-black font-semibold text-sm"
                    whileHover={{ color: "white" }}
                    transition={{ duration: 0.2 }}
                  >
                    {number}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Step 1 */}
          <motion.div
            className="text-center md:text-start lg:text-start cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#35AB4E] transition-colors">
              {isAr ? "سجّل مجانًا خلال ثوانٍ معدودة" : "Sign Up for Free"}
            </h3>
            <p className="text-gray-600">
              {isAr ? "ابدأ رحلتك التعليمية بسهولة وسرعة." : "Create your account in seconds"}
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="text-center md:text-start lg:text-start cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#35AB4E] transition-colors">
              {isAr ? "اختر مسارك التعليمي المناسب" : "Choose Your Learning Path"}
            </h3>
            <p className="text-gray-600">
              {isAr ? "من المستوى المبتدئ حتى المتقدم (A1–C1)." : "Beginner to advanced levels (A1-C1)"}
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="text-center md:text-start lg:text-start cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#35AB4E] transition-colors">
              {isAr ? "ابدأ التدريب والتفاعل مع الذكاء الاصطناعي" : "Start Practicing"}
            </h3>
            <p className="text-gray-600">
              {isAr ? "تحدث، استمع، ناقش، وشارك في ألعاب تعليمية ممتعة" : "Speak, listen, debate, and play games with AI."}
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            className="text-center md:text-start lg:text-start cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#35AB4E] transition-colors">
              {isAr ? "راقب تقدمك واحصل على شهادتك" : "Track Results"}
            </h3>
            <p className="text-gray-600">
              {isAr ? "شاهد نتائجك وتطور مستواك في كل مهارة." : "See progress charts and get certificates."}
            </p>
          </motion.div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Link to="/chinese/contact-us">
            <button className="border border-gray-300 text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 hover:border-[#35AB4E] transition-all active:scale-95">
              {isAr ? (
                <>
                  هل ترغب في التجربة؟{" "}
                  <span className="text-[#35AB4E] font-bold">
                    جرّب زيد مجانًا الآن!
                  </span>
                </>
              ) : (
                <>
                  Want to see?{" "}
                  <span className="text-[#35AB4E] font-bold">
                    Try Zayd AI
                  </span>
                </>
              )}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
