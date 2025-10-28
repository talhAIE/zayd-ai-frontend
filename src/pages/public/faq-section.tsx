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
      className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#F6FAFF] to-white overflow-hidden"
    >
      {/* === Gradient Circle: Top-Right === */}
      <div
        className="absolute rounded-full"
        style={{
          width: "576px",
          height: "576px",
          top: "-238px",
          left: "996px",
          background: "#3764B452",
          filter: "blur(240px)",
          zIndex: 0,
        }}
      />

      {/* === Gradient Circle: Bottom-Left === */}
      <div
        className="absolute rounded-full"
        style={{
          width: "576px",
          height: "576px",
          top: "365px",
          left: "-301px",
          background: "#3764B452",
          filter: "blur(240px)",
          zIndex: 0,
        }}
      />

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
        <div className="w-full md:w-1/2 flex items-center md:items-start justify-center md:justify-start">
          <h2
            className="font-bold text-center md:text-left"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 800,
              fontSize: "48px",
              lineHeight: "52px",
              letterSpacing: "-0.01em",
              color: "#058BF4",
            }}
          >
            Frequently Asked <br />
            Questions
          </h2>
        </div>

        {/* Right Side — Accordion */}
        <div className="w-full md:w-1/2 border-t border-gray-200 pt-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-5">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
                style={{
                  fontFamily: "Source Serif 4, serif",
                  fontWeight: 500,
                  fontSize: "17px",
                  lineHeight: "24px",
                  color: "#000000",
                  maxWidth: "644px",
                }}
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600 w-5 h-5 shrink-0" />
                ) : (
                  <ChevronDown className="text-gray-600 w-5 h-5 shrink-0" />
                )}
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <p
                  style={{
                    fontFamily: "Source Serif 4, serif",
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "24px",
                    color: "#555555",
                    maxWidth: "644px",
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
