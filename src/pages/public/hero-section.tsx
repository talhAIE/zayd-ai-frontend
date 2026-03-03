import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import pointingSvg from "@/assets/images/landingpage/malewithfalcon.png";
import { useLanguage } from "@/components/language-provider";
import LanguageTabSwitcher from "@/components/ui/LanguageTabSwitcher";

export default function HeroSection() {
  const { language } = useLanguage();
  const words = ["Learning", "Fluency", "Progress", "Skills", "Growth"];
  const arabicWords = ["التعلم", "الطلاقة", "التقدم", "المهارات", "النمو"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  const currentWords = language === "ar" ? arabicWords : words;
  return (
    <section
      id="home"
      className="pt-12 pb-12 min-[639px]:pt-10 min-[639px]:pb-0 max-[1024px]:pt-10 max-[1024px]:pb-0 min-[1025px]:pt-12 min-[1025px]:pb-12 flex flex-col items-center justify-center text-center relative px-3 bg-white"
    >
      <motion.p
        className="uppercase text-sm text-gray-500 font-semibold tracking-wide mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {language === "ar"
          ? "زيد AI – أطلق قوة المستقبل في تعلم اللغة الإنجليزية"
          : "Zayd AI — Unleash the Power of AI"}
      </motion.p>

      <LanguageTabSwitcher />

      <div className="relative max-w-7xl mx-auto">
        <div className="relative inline-block z-50">
          <motion.h1
            className="sm:text-7xl text-5xl font-bold text-gray-900 mb-6 inline-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {language === "ar" ? (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  افتح آفاق المستقبل
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    lineHeight: "1.2",
                    marginLeft: "1rem",
                  }}
                >
                  لتعلم الإنجليزية{" "}
                </motion.span>
                <motion.span
                  className="lg:inline hidden relative"
                  style={{
                    lineHeight: "1.2",
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    maxWidth: "320px",
                    whiteSpace: "nowrap",
                  }}
                  layout
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={currentWordIndex}
                      className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent underline decoration-[#058BF4] decoration-4 underline-offset-[12px] inline-block whitespace-nowrap"
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: 60,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0.0, 0.2, 1],
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      layout
                      style={{ display: "inline-block" }}
                    >
                      {currentWords[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                >
                  بطريقة ذكية وممتعة
                </motion.span>
              </>
            ) : (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  Unlock the Future
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    lineHeight: "1.2",
                    marginRight: "1rem",
                  }}
                >
                  of English{" "}
                </motion.span>
                <motion.span
                  className="lg:inline hidden relative"
                  style={{
                    lineHeight: "1.2",
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    maxWidth: "320px",
                    whiteSpace: "nowrap",
                  }}
                  layout
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={currentWordIndex}
                      className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent underline decoration-[#058BF4] decoration-4 underline-offset-[12px] inline-block whitespace-nowrap"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: -60,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0.0, 0.2, 1],
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      layout
                      style={{ display: "inline-block" }}
                    >
                      {currentWords[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </>
            )}
          </motion.h1>
        </div>

        <motion.div
          className={`absolute top-[3.2rem] xl:flex hidden z-10 ${
            language === "ar" ? "left-[-13.5rem]" : "right-[-13.5rem]"
          }`}
          initial={{ x: language === "ar" ? -100 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.5,
          }}
        >
          <img
            src={pointingSvg}
            alt="Pointing"
            width={250}
            height={250}
            className="flip-in-en"
          />
        </motion.div>
      </div>

      <motion.p
        className={`font-normal ${
          language === "ar" ? "text-[15px]" : "text-[20px]"
        } leading-[24px] tracking-[0px] text-gray-600 text-center mx-auto mb-10 max-w-2xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      >
        {language === "ar" ? (
          <>
            دورات لغة إنجليزية مدعومة بالذكاء الاصطناعي، صُممت خصيصًا لتناسب
            المتعلمين العرب. <br />
            تجربة تعليمية تفاعلية، شخصية، ومتوافقة مع ثقافتنا العربية للطلاب من
            الصف الرابع الابتدائي إلى الصف الثالث الثانوي.
          </>
        ) : (
          <>
            AI-powered English courses designed for Arab learners. <br />
            Interactive, personalized, and culturally relevant education for
            students grades 4-12.
          </>
        )}
      </motion.p>

      {/* Buttons with icons */}
      <motion.div
        className="flex flex-col lg:flex-row justify-center gap-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/login">
            <Button
              className="w-full lg:w-auto rounded-full px-6 py-5 text-base text-white flex items-center gap-2 hover:opacity-90 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)",
              }}
            >
              Start Free Trial
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="https://aitutorappstorage.blob.core.windows.net/aitutorblob/user_guide/Zayd%20AI%20parent%20guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="w-full lg:w-auto rounded-full px-6 py-5 text-base flex items-center gap-2 border-[#058BF4] text-[#058BF4] hover:text-[border-[#058BF4]]"
            >
              View Guide
              <svg
                width="28"
                height="23"
                viewBox="0 0 28 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.51855 2.55554L22.1482 11.5L8.51855 20.4444"
                  fill="#058BF4"
                />
                <path
                  d="M8.51855 2.55554L22.1482 11.5L8.51855 20.4444V2.55554Z"
                  stroke="#058BF4"
                  strokeWidth="1.1358"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </a>
        </motion.div>
      </motion.div>

      <motion.p
        className="text-blue-500 text-sm pt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
      >
        Join thousands of students
      </motion.p>
    </section>
  );
}
