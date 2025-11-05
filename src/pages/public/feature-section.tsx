import teachImg from "@/assets/images/landingpage/teach.svg";
import chatmodeImg from "@/assets/images/landingpage/chatmode.png";
import { motion } from "framer-motion";
import MaleThinking from "@/assets/images/landingpage/malethinking.png";
import FemaleCertificate from "@/assets/images/landingpage/femalecertificate.png";
import MaleFemaleShield from "@/assets/images/landingpage/malefemaleshield.png";
import MaleProfessor from "@/assets/images/landingpage/maleprofessor.png";
import FemaleBrowsing from "@/assets/images/landingpage/femalebrowsing.png";
import Male from "@/assets/images/landingpage/male.png";
import Female from "@/assets/images/landingpage/female.png";
import Falcon from "@/assets/images/landingpage/eagle.png";
import { useState } from "react";

export default function FeatureSection() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      title: "Real Conversation",
      isActive: true,
      category: "AI Chatbot",
      heading: "Real Conversations",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: MaleThinking,
      imageSize: { width: 200, height: 200 },
      imagePosition: { left: "15rem", top: "60rem" },
      svg: (isSelected: boolean) => (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 22C18.1667 22 17.4583 21.7083 16.875 21.125C16.2917 20.5417 16 19.8333 16 19V13C16 12.1667 16.2917 11.4583 16.875 10.875C17.4583 10.2917 18.1667 10 19 10C19.8333 10 20.5417 10.2917 21.125 10.875C21.7083 11.4583 22 12.1667 22 13V19C22 19.8333 21.7083 20.5417 21.125 21.125C20.5417 21.7083 19.8333 22 19 22ZM18 29V25.925C16.2667 25.6917 14.8333 24.9167 13.7 23.6C12.5667 22.2833 12 20.75 12 19H14C14 20.3833 14.4877 21.5627 15.463 22.538C16.4383 23.5133 17.6173 24.0007 19 24C20.3827 23.9993 21.562 23.5117 22.538 22.537C23.514 21.5623 24.0013 20.3833 24 19H26C26 20.75 25.4333 22.2833 24.3 23.6C23.1667 24.9167 21.7333 25.6917 20 25.925V29H18Z"
            fill={isSelected ? "#1C91F5" : "#2B2B2B"}
          />
          <defs>
            <linearGradient
              id="paint0_linear_1_141"
              x1="0"
              y1="19"
              x2="38"
              y2="19"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#76ABF8" />
              <stop offset="0.485577" stopColor="#058BF4" />
              <stop offset="0.8" stopColor="#63B3F6" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1_141"
              x1="12"
              y1="19.5"
              x2="26"
              y2="19.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#76ABF8" />
              <stop offset="0.485577" stopColor="#058BF4" />
              <stop offset="0.8" stopColor="#63B3F6" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      title: "Reading & Listening Stories",
      category: "AI Chatbot",
      heading: "Reading & Listening stories",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: FemaleBrowsing,
      imageSize: { width: 200, height: 200 },
      imagePosition: { left: "15rem", top: "60rem" },
      svg: (isSelected: boolean) => (
        <svg
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1_137)">
            <path
              d="M5.00001 15.6538C5.7529 15.6538 6.4854 15.7392 7.19751 15.91C7.90963 16.0807 8.61653 16.3486 9.3182 16.7134V7.77612C8.67956 7.36007 7.98842 7.04802 7.24479 6.83999C6.50115 6.63196 5.7529 6.52794 5.00001 6.52794C4.45456 6.52794 3.94494 6.57075 3.47115 6.65635C2.99736 6.74211 2.51047 6.88226 2.01047 7.0768C1.94062 7.10014 1.89108 7.1337 1.86183 7.17749C1.83274 7.22112 1.8182 7.26916 1.8182 7.32158V15.9196C1.8182 16.0012 1.84736 16.0609 1.9057 16.0988C1.96388 16.1368 2.02797 16.141 2.09797 16.1118C2.52918 15.965 2.98426 15.8519 3.4632 15.7727C3.94229 15.6935 4.45456 15.6538 5.00001 15.6538ZM10.6818 16.7134C11.3835 16.3486 12.0904 16.0807 12.8026 15.91C13.5147 15.7392 14.2471 15.6538 15 15.6538C15.5455 15.6538 16.0577 15.6935 16.5368 15.7727C17.0157 15.8519 17.4708 15.965 17.9021 16.1118C17.9721 16.141 18.0362 16.1368 18.0944 16.0988C18.1527 16.0609 18.1818 16.0012 18.1818 15.9196V7.32158C18.1818 7.26916 18.1673 7.22257 18.1382 7.1818C18.1089 7.14105 18.0594 7.10605 17.9896 7.0768C17.4896 6.88226 17.0027 6.74211 16.5289 6.65635C16.0551 6.57075 15.5455 6.52794 15 6.52794C14.2471 6.52794 13.4988 6.63196 12.7552 6.83999C12.0116 7.04802 11.3205 7.36007 10.6818 7.77612V16.7134ZM10 18.7132C9.26701 18.1724 8.47622 17.7546 7.62774 17.4598C6.77926 17.1649 5.90335 17.0175 5.00001 17.0175C4.44531 17.0175 3.90047 17.0789 3.36547 17.2018C2.83047 17.3248 2.31471 17.5058 1.8182 17.7447C1.49426 17.8938 1.186 17.8702 0.893423 17.6738C0.600847 17.4775 0.454559 17.1992 0.454559 16.8391V6.96862C0.454559 6.77271 0.505014 6.58885 0.605923 6.41703C0.70668 6.24507 0.852059 6.1212 1.04206 6.04544C1.65736 5.74589 2.29865 5.52415 2.96592 5.38022C3.6332 5.23628 4.31122 5.16431 5.00001 5.16431C5.88456 5.16431 6.74881 5.28522 7.59274 5.52703C8.43653 5.769 9.23892 6.12598 10 6.59794C10.7611 6.12598 11.5635 5.769 12.4073 5.52703C13.2512 5.28522 14.1155 5.16431 15 5.16431C15.6888 5.16431 16.3668 5.23628 17.0341 5.38022C17.7014 5.52415 18.3427 5.74589 18.958 6.04544C19.1479 6.1212 19.2934 6.24507 19.3941 6.41703C19.495 6.58885 19.5455 6.77271 19.5455 6.96862V16.8391C19.5455 17.1992 19.3934 17.4746 19.0891 17.6652C18.7848 17.8557 18.4649 17.8764 18.1294 17.7273C17.6387 17.4941 17.1303 17.3175 16.6041 17.1975C16.0779 17.0775 15.5432 17.0175 15 17.0175C14.0967 17.0175 13.2207 17.1649 12.3723 17.4598C11.5238 17.7546 10.733 18.1724 10 18.7132Z"
              fill={isSelected ? "#1C91F5" : "black"}
            />
          </g>
          <defs>
            <clipPath id="clip0_1_137">
              <rect width="20" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      title: "Role Play & Debates",
      category: "AI Chatbot",
      heading: "Role Play & Debates",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: MaleProfessor,
      imageSize: { width: 200, height: 200 },
      imagePosition: { left: "15rem", top: "60rem" },
      multipleImages: [
        {
          src: Male,
          alt: "Male Character",
          size: { width: 120, height: 120 },
          position: { left: "16rem", top: "40rem" },
        },
        {
          src: Falcon,
          alt: "Falcon",
          size: { width: 110, height: 110 },
          position: { left: "25rem", top: "47rem" },
        },
        {
          src: Female,
          alt: "Female Character",
          size: { width: 120, height: 120 },
          position: { left: "16rem", top: "54rem" },
        },
      ],
      svg: (isSelected: boolean) => (
        <svg
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.92765 22H2.12676C1.53245 22 1.02941 21.7941 0.617647 21.3824C0.205882 20.9706 0 20.4675 0 19.8733V12C0 10.6124 0.262451 9.31226 0.787353 8.09971C1.31226 6.88696 2.02568 5.82961 2.92765 4.92765C3.82961 4.02568 4.88696 3.31226 6.09971 2.78735C7.31226 2.26245 8.61235 2 10 2C11.3876 2 12.6878 2.26245 13.9002 2.78735C15.1131 3.31226 16.1704 4.02568 17.0724 4.92765C17.9744 5.82961 18.6878 6.88696 19.2126 8.09971C19.7375 9.31226 20 10.6124 20 12V19.8733C20 20.4675 19.7941 20.9706 19.3824 21.3824C18.9706 21.7941 18.4675 22 17.8733 22H14.0724V13.6741H18.2353V12C18.2353 9.70588 17.4362 7.7598 15.8382 6.16176C14.2402 4.56373 12.2941 3.76471 10 3.76471C7.70588 3.76471 5.7598 4.56373 4.16176 6.16176C2.56373 7.7598 1.76471 9.70588 1.76471 12V13.6741H5.92765V22ZM4.16294 15.4388H1.76471V19.8733C1.76471 19.9638 1.80245 20.0468 1.87794 20.1221C1.95324 20.1975 2.03618 20.2353 2.12676 20.2353H4.16294V15.4388ZM15.8371 15.4388V20.2353H17.8733C17.9638 20.2353 18.0468 20.1975 18.1221 20.1221C18.1975 20.0468 18.2353 19.9638 18.2353 19.8733V15.4388H15.8371Z"
            fill={isSelected ? "#1C91F5" : "black"}
          />
        </svg>
      ),
    },
    {
      title: "Certificates",
      category: "AI Chatbot",
      heading: "Certificates",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: FemaleCertificate,
      imageSize: { width: 350, height: 350 },
      imagePosition: { left: "6rem", top: "61rem" },
      svg: (isSelected: boolean) => (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.5625 2.8125L10.5619 12.525C8.16562 14.0138 6.5625 16.6631 6.5625 19.6875C6.5625 24.3394 10.3472 28.125 15 28.125C19.6528 28.125 23.4375 24.3394 23.4375 19.6875C23.4375 16.6641 21.8344 14.0147 19.4381 12.525L23.4375 2.8125H21.4106L17.7431 11.7169C17.1182 11.5001 16.47 11.3576 15.8119 11.2922L19.3003 2.8125H17.2734L13.7559 11.3531C13.2459 11.4283 12.7438 11.5501 12.2559 11.7169L8.58937 2.8125H6.5625ZM10.6987 2.8125L13.0809 8.60063L14.0953 6.13781L12.7266 2.8125H10.6987ZM15 13.125C18.6178 13.125 21.5625 16.0688 21.5625 19.6875C21.5625 23.3062 18.6178 26.25 15 26.25C11.3822 26.25 8.4375 23.3062 8.4375 19.6875C8.4375 16.0688 11.3822 13.125 15 13.125ZM15 16.0894L13.905 18.5456L11.25 18.8362L13.2375 20.6213L12.6778 23.2556L15 21.9169L17.3222 23.2575L16.7634 20.6231L18.75 18.8353L16.095 18.5447L15 16.0894Z"
            fill={isSelected ? "#1C91F5" : "black"}
          />
        </svg>
      ),
    },
    {
      title: "Safe & Secure",
      category: "AI Chatbot",
      heading: "Safe & Secure",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: MaleFemaleShield,
      imageSize: { width: 200, height: 200 },
      imagePosition: null, // No left-side positioning for shield
      svg: (isSelected: boolean) => (
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1249 12.3752L12.3751 14.6248L16.8749 10.125"
            stroke={isSelected ? "#1C91F5" : "black"}
            strokeWidth="1.08"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 23.625L14.4898 23.1973C16.5652 22.3067 18.3573 20.8652 19.6721 19.029C20.9869 17.1928 21.7742 15.0318 21.9488 12.7802L22.4326 6.57018C22.4405 6.313 22.3599 6.06092 22.2042 5.85607C22.0485 5.65123 21.8272 5.50605 21.5773 5.44482L13.5 3.375L5.42264 5.4C5.17283 5.46122 4.9516 5.60631 4.79591 5.81104C4.64023 6.01577 4.55952 6.26774 4.56728 6.52482L5.05112 12.7348C5.22559 14.9866 6.01287 17.1476 7.32767 18.984C8.64247 20.8203 10.4347 22.2619 12.5101 23.1525L13.5 23.625Z"
            stroke={isSelected ? "#1C91F5" : "black"}
            strokeWidth="1.08"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Smart Assessments",
      category: "AI Chatbot",
      heading: "Smart Assessments",
      description: "Practice speaking with an AI tutor, anytime, anywhere.",
      image: MaleProfessor,
      imageSize: { width: 300, height: 300 },
      imagePosition: { left: "14rem", top: "56rem" },
      svg: (isSelected: boolean) => (
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5001 24.75C19.7133 24.75 24.7501 19.7132 24.7501 13.5C24.7501 7.2868 19.7133 2.25 13.5001 2.25C7.28692 2.25 2.25012 7.2868 2.25012 13.5C2.25012 19.7132 7.28692 24.75 13.5001 24.75Z"
            stroke={isSelected ? "#1C91F5" : "black"}
            strokeWidth="1.6875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.3754 20.0069C15.3206 20.8811 17.9329 19.2937 19.1254 16.8749M7.87537 10.1362C7.87537 10.1362 9.46162 9.99332 10.3459 10.6964M10.3459 10.6964L10.05 11.6358C9.93299 12.0059 10.2379 12.3749 10.6609 12.3749C11.1064 12.3749 11.4 11.9733 11.1705 11.6268C10.9451 11.2761 10.667 10.9623 10.3459 10.6964ZM15.7504 10.1373C15.7504 10.1373 17.3366 9.99332 18.2209 10.6964M18.2209 10.6964L17.925 11.6358C17.808 12.0059 18.1129 12.3749 18.5359 12.3749C18.9814 12.3749 19.275 11.9733 19.0455 11.6268C18.8201 11.2761 18.542 10.9623 18.2209 10.6964Z"
            stroke={isSelected ? "#1C91F5" : "black"}
            strokeWidth="1.6875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="features"
      className="relative sm:py-20 py-4 bg-cover bg-center bg-no-repeat overflow-hidden"
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-block bg-white border border-gray-300 rounded-full px-6 py-2 mb-6 shadow-sm"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-gray-600 text-sm font-medium">
              Advanced features
            </p>
          </motion.div>

          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              className="w-80 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold">
                <motion.span
                  className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  Features
                </motion.span>{" "}
                <motion.span
                  className="text-gray-900"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                  that Stand out
                </motion.span>
              </h2>
            </motion.div>

            {/* Bird illustration - positioned absolutely so it doesn't affect text centering */}
            <motion.div
              className="lg:flex hidden absolute right-[18rem] top-[0rem] transform -translate-y-1/2 w-24 h-24"
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
                className="scale-[200%]"
                src={teachImg}
                alt="Teach illustration"
                width={100}
                height={100}
              />
            </motion.div>
          </div>
        </div>

        {/* Feature Icons Row */}
        <motion.div
          className="border border-[#E5E7EB] bg-transparent rounded-2xl p-2 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center cursor-pointer"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.7 + index * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFeature(index)}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                    selectedFeature === index ? "bg-blue-50 rounded-xl" : ""
                  }`}
                  animate={{
                    scale: selectedFeature === index ? 1.1 : 1,
                    backgroundColor:
                      selectedFeature === index ? "#EFF6FF" : "transparent",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{
                      scale: selectedFeature === index ? 1.1 : 1,
                      rotate: selectedFeature === index ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      rotate: {
                        duration: 0.6,
                        repeat: selectedFeature === index ? Infinity : 0,
                        repeatDelay: 2,
                      },
                    }}
                  >
                    {typeof feature.svg === "function"
                      ? feature.svg(selectedFeature === index)
                      : feature.svg}
                  </motion.div>
                </motion.div>
                <motion.p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    selectedFeature === index
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                  animate={{
                    color: selectedFeature === index ? "#3B82F6" : "#6B7280",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.title}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Character Image - Positioned absolutely like before */}
        {selectedFeature === 2 && features[selectedFeature].multipleImages ? (
          // Special case for Role Play & Debates - show multiple character images on left side
          <>
            {features[selectedFeature].multipleImages.map((imgData, index) => (
              <div
                key={`roleplay-left-${index}`}
                className="absolute -translate-y-1/2 hidden lg:block"
                style={{
                  left: imgData.position.left,
                  top: imgData.position.top,
                }}
              >
                <motion.img
                  src={imgData.src}
                  alt={imgData.alt}
                  width={imgData.size.width}
                  height={imgData.size.height}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    },
                  }}
                />
              </div>
            ))}
          </>
        ) : features[selectedFeature].imagePosition ? (
          // Default case - show single character image on left side
          <div
            className="absolute -translate-y-1/2 hidden lg:block"
            style={{
              left: features[selectedFeature].imagePosition.left,
              top: features[selectedFeature].imagePosition.top,
            }}
          >
            <motion.img
              key={selectedFeature}
              src={features[selectedFeature].image}
              alt={features[selectedFeature].title}
              width={features[selectedFeature].imageSize.width}
              height={features[selectedFeature].imageSize.height}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        ) : null}

        {/* Bottom Section with Chat Interface */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
        >
          {/* Left Side - Dynamic Feature Description */}
          <motion.div
            className="space-y-6"
            key={selectedFeature}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.span
                className="text-blue-500 font-medium"
                animate={{
                  color: ["#3B82F6", "#1D4ED8", "#3B82F6"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {features[selectedFeature].category}
              </motion.span>
              <motion.div
                className="ms-1 w-1 h-1 bg-blue-300 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </motion.div>

            <motion.h3
              className="w-80 text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {features[selectedFeature].heading}
            </motion.h3>

            <motion.p
              className="w-80 text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {features[selectedFeature].description}
            </motion.p>
          </motion.div>

          {/* Right Side - Dynamic Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {selectedFeature === 4 ? (
              // Special case for Safe & Secure - show character image on right
              <div className="flex items-center justify-center sm:h-[30rem] h-[20rem]">
                <motion.img
                  key={`right-${selectedFeature}`}
                  src={features[selectedFeature].image}
                  alt={features[selectedFeature].title}
                  width={features[selectedFeature].imageSize.width}
                  height={features[selectedFeature].imageSize.height}
                  className="w-auto h-auto max-w-full max-h-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ) : (
              // Default case - show chat interface
              <motion.div
                className="bg-gradient-to-b from-blue-100 via-blue-300 to-blue-400 rounded-2xl p-8 shadow-lg sm:h-[30rem] h-[20rem] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.img
                  src={chatmodeImg}
                  alt="Chat Mode Interface"
                  width={500}
                  height={400}
                  className="sm:w-4/5 w-full h-auto rounded-xl mx-auto"
                  style={{ objectFit: "contain" }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
