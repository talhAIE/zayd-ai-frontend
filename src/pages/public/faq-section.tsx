import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Female from "@/assets/images/landingpage/femalethinking.png";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is Zayd suitable for beginners?",
      answer: "Yes, from A1 to C1 levels.",
    },
    {
      question: "Do teachers or students need training?",
      answer:
        "No formal training is required — Zayd AI is designed to be intuitive and teacher-friendly.",
    },
    {
      question: "Is Zayd safe for children?",
      answer:
        "Absolutely. Zayd complies with strict data safety and privacy standards.",
    },
  ];

  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      id="faq"
      className="relative w-full pt-[3%] pb-32 md:pb-40 lg:pb-52 xl:pb-64 flex items-center justify-center overflow-hidden"
    >

      {/* === Main FAQ Content === */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-16 px-6 md:px-20">
        <motion.div
          className="absolute left-[25rem] top-[3rem] -translate-y-1/2 hidden lg:block"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.3,
          }}
        >
          <img src={Female} alt="Female" width={200} height={200} />
        </motion.div>

        {/* Left Side — Title */}
        <motion.div
          className="w-full md:w-1/2 flex items-center md:items-start justify-center md:justify-start"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="font-bold text-center md:text-left"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 800,
              fontSize: "48px",
              lineHeight: "52px",
              letterSpacing: "-0.01em",
              color: "#058BF4",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
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
          </motion.h2>
        </motion.div>

        {/* Right Side — Accordion */}
        <motion.div
          className="w-full md:w-1/2 border-t border-gray-200 pt-2"
          initial={{ opacity: 0, x: 50 }}
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
                className="w-full flex justify-between items-center text-left focus:outline-none group"
                style={{
                  fontFamily: "Source Serif 4, serif",
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "24px",
                  color: "#000000",
                  maxWidth: "644px",
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  animate={{
                    color: openIndex === index ? "#058BF4" : "#000000",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.question}
                </motion.span>
                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                    color: openIndex === index ? "#058BF4" : "#6B7280",
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
                    fontFamily: "Source Serif 4, serif",
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "24px",
                    color: "#555555",
                    maxWidth: "644px",
                  }}
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
                  {faq.answer}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
