import flyingImg from "@/assets/images/landingpage/flying.svg";
import dashboardImg from "@/assets/images/landingpage/dashboard.png";
import { motion, Variants } from "framer-motion";

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const DashboardSection = () => {
  return (
    <div
      id="dashboard"
      className="sm:mt-20 mt-0 sm:pt-10 pt-0 relative bg-linear-to-b overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main dashboard container */}
      <div className="relative z-10 container mx-auto px-4 sm:py-16 py-4">
        <div className="relative max-w-6xl mx-auto">
          {/* Flying bird decoration */}
          <div className="lg:flex hidden absolute top-[-3rem] right-[1rem] z-[100]">
            <img src={flyingImg} alt="Flying bird" width={150} height={150} />
          </div>
          {/* Dashboard Image */}
          <motion.div
            className="flex justify-center"
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src={dashboardImg}
              alt="Student Dashboard"
              width={1000}
              height={500}
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>

          {/* Footer text */}
          <div className="text-center mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <p className="text-[#058BF4] font-medium">
                Trusted by the Gifted Education Department in Makkah.
              </p>
              <p className="text-[#058BF4] font-medium">
                Fun, interactive, and personalized English practice for students
                Grades 4-12.
              </p>
              <p className="text-[#058BF4] font-medium">
                Designed for Arab learners, with AI that understands cultural
                context
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
