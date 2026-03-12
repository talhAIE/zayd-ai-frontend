import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBird from "@/assets/images/landingpage/hero bird 1.png";
import dumbbellImg from "@/assets/images/landingpage/Object.png";
import LanguageTabSwitcher from "@/components/ui/LanguageTabSwitcher";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center bg-white px-4 pt-10 pb-14 overflow-hidden"
    >
      {/* Outer wrapper — max width keeps the trio together, never spread to screen edges */}
      <div className="flex items-center justify-center w-full max-w-[1280px] mx-auto gap-6">

        {/* Left: dumbbell — fixed width, never shrinks */}
        <motion.div
          className="xl:block hidden flex-shrink-0"
          style={{ width: 280 }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={dumbbellImg}
            alt="Dumbbell"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Centre: text — fixed min-width so heading never squeezes onto 3 lines */}
        <div className="flex flex-col items-center text-center z-10 flex-shrink-0 min-w-[620px]">
          {/* Language switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mb-7"
          >
            <LanguageTabSwitcher />
          </motion.div>

          {/* Headline — <br> forces the same 2-line split every time */}
          <motion.h1
            className="text-6xl sm:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            The Language Gym for
            <br />
            the Modern Student.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            Just as the gym builds your muscles, Zayd builds your language.
            Practice English or Chinese with AI-driven training designed for
            fluency, accuracy, and perfect prosody.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link to="/login">
              <Button
                className="rounded-full px-8 py-6 text-base font-semibold text-white flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)",
                }}
              >
                Start Practice
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
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-5 text-sm text-[#058BF4]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            No credit card required&nbsp;•&nbsp;Join thousands of students
          </motion.p>
        </div>

        {/* Right: bird — fixed width, never shrinks */}
        <motion.div
          className="xl:block hidden flex-shrink-0"
          style={{ width: 280 }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={heroBird}
            alt="Zayd mascot lifting weights"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>

      </div>
    </section>
  );
}
