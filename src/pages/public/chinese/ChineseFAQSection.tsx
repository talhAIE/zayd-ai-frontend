import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Female from "@/assets/images/landingpage/femalethinking.png";
import { useLanguage } from "@/components/language-provider";

export default function ChineseFAQSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: {
        en: "Is Zayd suitable for beginners?",
        ar: "هل زيد مناسب للمبتدئين؟",
      },
      answer: {
        en: "Yes, from A1 to C1 levels for both English and Chinese.",
        ar: "نعم، المنصة تغطي جميع المستويات من المبتدئ إلى المتقدم للغتين الإنجليزية والصينية.",
      },
    },
    {
      question: {
        en: "Do teachers or students need training?",
        ar: "هل يحتاج المعلمون أو الطلاب إلى تدريب خاص؟",
      },
      answer: {
        en: "No formal training is required — Zayd AI is designed to be intuitive and teacher-friendly.",
        ar: "لا، فواجهة المنصة سهلة الاستخدام وصُممت لتكون مريحة ومناسبة للمعلمين والطلاب.",
      },
    },
    {
      question: {
        en: "Is Zayd safe for children?",
        ar: "هل زيد آمن للأطفال؟",
      },
      answer: {
        en: "Absolutely. Zayd complies with strict data safety and privacy standards, including SADAIA certification.",
        ar: "بالتأكيد. زيد يلتزم بمعايير صارمة لحماية البيانات والخصوصية، وحاصل على اعتماد سدايا.",
      },
    },
    {
        question: {
          en: "What curriculum does Zayd AI follow?",
          ar: "ما هو المنهج الذي تتبعه منصة زيد؟",
        },
        answer: {
          en: "Zayd AI is aligned with global language standards and can be customized to match Saudi local curriculum requirements.",
          ar: "زيد يتوافق مع معايير تعلم اللغات العالمية ويمكن تخصيصه ليتوافق مع متطلبات المناهج السعودية المحلية.",
        },
      },
  ];

  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      id="faq"
      className={`relative w-full pt-[3%] pb-32 md:pb-40 lg:pb-52 xl:pb-64 flex items-center justify-center overflow-hidden bg-white ${isAr ? 'font-almarai' : 'font-nunito'}`}
    >
      {/* === Main FAQ Content === */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-16 px-6 md:px-20">
        <motion.div
          className={`absolute top-[3rem] -translate-y-1/2 hidden lg:block ${
            isAr
              ? "right-[25rem] max-[1080px]:right-[22rem]"
              : "left-[25rem] max-[1080px]:left-[22rem]"
          }`}
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.3,
          }}
        >
          <img
            src={Female}
            alt="Female thinking"
            width={200}
            height={200}
            className={isAr ? "-scale-x-100" : ""}
          />
        </motion.div>

        {/* Left Side — Title */}
        <motion.div
          className="w-full md:w-1/2 flex items-center md:items-start justify-center md:justify-start"
          initial={{ opacity: 0, x: isAr ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className={`font-extrabold text-center md:text-left ${isAr ? 'md:text-right' : 'md:text-left'}`}
            style={{
              fontSize: "48px",
              lineHeight: "52px",
              letterSpacing: "-0.01em",
              color: "#35AB4E",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {isAr ? (
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                الأسئلة الشائعة
              </motion.span>
            ) : (
              <>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  Frequently Asked
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                  Questions
                </motion.span>
              </>
            )}
          </motion.h2>
        </motion.div>

        {/* Right Side — Accordion */}
        <motion.div
          className="w-full md:w-1/2 border-t border-gray-200 pt-2"
          initial={{ opacity: 0, x: isAr ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 py-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.6 + index * 0.2,
              }}
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className={`w-full flex justify-between items-center focus:outline-none group ${
                  isAr ? "text-right" : "text-left"
                }`}
                style={{
                  fontWeight: 600,
                  fontSize: "17px",
                  lineHeight: "24px",
                  color: "#000000",
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  animate={{
                    color: openIndex === index ? "#35AB4E" : "#000000",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                  style={{
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {faq.question[language]}
                </motion.span>
                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                    color: openIndex === index ? "#35AB4E" : "#6B7280",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  )}
                </motion.div>
              </motion.button>

              {/* Answer */}
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="overflow-hidden"
              >
                <motion.p
                  style={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "24px",
                    color: "#555555",
                    maxWidth: "644px",
                    textAlign: isAr ? "right" : "left",
                  }}
                  className="pt-4 pb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{
                    y: openIndex === index ? 0 : -10,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: openIndex === index ? 0.1 : 0,
                  }}
                >
                  {faq.answer[language]}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
