import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import pointingSvg from "@/assets/images/landingpage/malewithfalcon.png";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen text-center py-20 relative px-3 bg-white"
    >
      <motion.p
        className="uppercase text-sm text-gray-500 font-semibold tracking-wide mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Zayd AI — Unleash the Power of AI
      </motion.p>

      <div className="relative inline-block z-50">
        <motion.h1
          className="text-7xl font-bold text-gray-900 mb-6 inline-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
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
          >
            of English{" "}
          </motion.span>
          <motion.span
            className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent sm:inline-flex hidden items-center underline decoration-[#058BF4] decoration-4 underline-offset-[12px]"
            style={{ lineHeight: "1.2" }}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.5,
              type: "spring",
              stiffness: 100,
            }}
          >
            Learning
          </motion.span>
        </motion.h1>
      </div>

      <motion.div
        className="absolute top-[9.5rem] right-[13rem] sm:flex hidden z-10"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.5,
        }}
      >
        <img src={pointingSvg} alt="Pointing" width={250} height={250} />
      </motion.div>

      <motion.p
        className="font-normal text-[20px] leading-[24px] tracking-[0px] text-gray-600 text-center mx-auto mb-10 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      >
        AI-powered English courses designed for Arab learners. <br />
        Interactive, personalized, and culturally relevant education for
        students grades 4-12.
      </motion.p>

      {/* Buttons with icons */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 mb-4"
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
              className="w-full sm:w-auto rounded-full px-6 py-5 text-base text-white flex items-center gap-2 hover:opacity-90 transition-opacity duration-300"
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
              className="w-full sm:w-auto rounded-full px-6 py-5 text-base flex items-center gap-2 border-[#058BF4] text-[#058BF4] hover:text-[border-[#058BF4]]"
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
