import repairImg from "@/assets/images/landingpage/repair.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FlowSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 px-6">
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
            <motion.button
              className="border border-gray-300 text-black px-6 py-2 rounded-full text-sm font-medium"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#f3f4f6",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              How it works
            </motion.button>
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
              So, how does it work?
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
            className="absolute -left-4 -top-[310%] z-10 hidden md:block"
            initial={{ opacity: 0, x: -50, scale: 0.5 }}
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
              className="w-40 h-40 transform scale-x-[-1]"
            />
          </motion.div>

          <div className="relative">
            {/* Gradient Background Bar with fading ends */}
            <motion.div
              className="h-12 bg-linear-to-r from-transparent via-blue-400 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 1.0 }}
              style={{ transformOrigin: "left" }}
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
                  className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.4 + number * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: "#3B82F6",
                    color: "white",
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
            className="text-center lg:text-start cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sign Up for Free
            </h3>
            <p className="text-gray-600">Create your account in seconds</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Choose Your Learning Path
            </h3>
            <p className="text-gray-600">Beginner to advanced levels (A1-C1)</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Practicing
            </h3>
            <p className="text-gray-600">
              Speak, listen, debate, and play games with AI.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Results
            </h3>
            <p className="text-gray-600">
              See progress charts and get certificates.
            </p>
          </motion.div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center">
          <Link to="/login">
            <button className="border border-gray-300 text-black px-8 py-3 rounded-full text-lg font-normal hover:bg-gray-300 transition-colors">
              Want to see?{" "}
              <span className="text-[#058BF4] font-normal">Try Zayd AI</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
