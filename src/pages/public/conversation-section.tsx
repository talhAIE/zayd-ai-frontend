import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import pointingNeutralImg from "@/assets/images/landingpage/pointingNeutral.svg";
import stripImg from "@/assets/images/landingpage/strip.png";
import { useLanguage } from "@/components/language-provider";

const ConversationSection = () => {
  const { language } = useLanguage();
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      title: {
        en: "Culturally Relevant",
        ar: "جاهز للمدارس والمؤسسات التعليمية",
      },
      description: {
        en: "Built for Arab students, respecting local values.",
        ar: "تمت تجربته فعليًا داخل المدارس ونال ثقة المعلمين والطلاب.",
      },
    },
    {
      title: {
        en: "Engaging & Fun",
        ar: "تعلم بمتعة وحماس",
      },
      description: {
        en: "Students practice with games, challenges, and role-play.",
        ar: "يتعلم الطلاب من خلال الألعاب، والتحديات، وتمثيل الأدوار التي تجعل التعلم مغامرة مثيرة.",
      },
    },
    {
      title: {
        en: "School-Ready",
        ar: "منصة تحترم ثقافتك وهويتك",
      },
      description: {
        en: "Already tested in classrooms and trusted by teachers.",
        ar: "منصة تعليمية تراعي قيمنا العربية وتقدم محتوى ملائمًا لبيئتنا التعليمية.",
      },
    },
    {
      title: {
        en: "Instant Progress Reports",
        ar: "تعلم اليوم... لتنجح غدًا",
      },
      description: {
        en: "AI tracks speaking, listening, and vocabulary growth.",
        ar: "يبني مهارات اللغة الضرورية للدراسة، والعمل، والتواصل في المستقبل.",
      },
    },
    {
      title: {
        en: "Affordable & Scalable",
        ar: "حل ذكي واقتصادي يناسب الجميع",
      },
      description: {
        en: "Schools save money and time compared to hiring teachers.",
        ar: "يوفر على المدارس الجهد والتكاليف مقارنة بتوظيف معلمين إضافيين.",
      },
    },
    {
      title: {
        en: "Future-Proof Learning",
        ar: "تابع تقدمك في أي لحظة",
      },
      description: {
        en: "Builds skills for study abroad, jobs, and communication.",
        ar: "الذكاء الاصطناعي يرصد تطور مهاراتك في التحدث، والاستماع، والمفردات بدقة.",
      },
    },
  ];

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      }
    );

    observer.observe(sectionElement);

    return () => {
      observer.unobserve(sectionElement);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="conversation"
      className="relative py-20 px-4 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white border border-gray-300 rounded-full px-6 py-2 mb-6 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">
              {language === "ar"
                ? "لماذا تختار المعلم زيد المدعوم بالذكاء الاصطناعي؟"
                : "Why choose Zayd AI"}
            </p>
          </div>

          <div className="relative">
            {/* Falcon Image */}
            <motion.div
              className="absolute left-[9rem] top-[3rem] max-[1310px]:left-[3vw] -translate-y-1/2 hidden lg:block"
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
                src={pointingNeutralImg}
                alt="Zayd AI Mascot"
                width={200}
                height={200}
                className="object-contain flip-in-en"
              />
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {language === "ar" ? (
                <>
                  تحدث وكأنك تتفاعل مع <br />
                  <span className="bg-gradient-to-r from-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent">
                    إنسان حقيقي
                  </span>
                  !
                </>
              ) : (
                <>
                  Experience{" "}
                  <span className="bg-gradient-to-r from-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent">
                    Humanlike
                  </span>
                  <br />
                  Conversations
                </>
              )}
            </h2>
          </div>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {language === "ar" ? (
              "تقنية ذكاء اصطناعي متطورة صُممت خصيصًا لتقديم تجربة تعلم إنجليزية شيقة ومتفهمة لثقافة المتعلم العربي."
            ) : (
              <>
                Advanced AI technology designed specifically for Arab learners,
                providing
                <br />
                culturally relevant and engaging English education.
              </>
            )}
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          {/* Strip background image */}
          <div className="absolute right-[20rem] -top-[6rem] bottom-50 sm:flex hidden items-center justify-start pointer-events-none">
            <img
              src={stripImg}
              alt="Background decoration"
              width={1400}
              height={1800}
              className="object-contain opacity-60 -ml-96 flip-in-en"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/20 backdrop-blur-md rounded-2xl p-8 transition-all duration-300 border border-[#E5E7EB] ${
                  isInView ? "animate-scale-in" : ""
                }`}
                style={{
                  animationDelay: isInView ? `${index * 150}ms` : "0ms",
                  animationFillMode: "both",
                }}
              >
                {/* Checkmark Icon */}
                <div className="mb-4">
                  <svg
                    width="45"
                    height="43"
                    viewBox="0 0 45 43"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M44.9167 21.3558L39.935 15.68L40.6292 8.16667L33.2588 6.4925L29.4 0L22.4583 2.98083L15.5167 0L11.6579 6.4925L4.2875 8.14625L4.98167 15.6596L0 21.3558L4.98167 27.0317L4.2875 34.5654L11.6579 36.2396L15.5167 42.7321L22.4583 39.7308L29.4 42.7117L33.2588 36.2192L40.6292 34.545L39.935 27.0317L44.9167 21.3558ZM18.375 31.5642L10.2083 23.3975L13.0871 20.5187L18.375 25.7862L31.8296 12.3317L34.7083 15.2308L18.375 31.5642Z"
                      fill="#058BF4"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title[language]}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-scrolling horizontal cards */}
      {/* <div className="sm:mt-40 mt-12 overflow-hidden">
        <div className="flex animate-scroll">
          <div className="flex space-x-4 shrink-0">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">Workout plan</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Transcribe my class notes
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Create a pros and cons list
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Morning Productivity Plan
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Experience Tokyo like a local
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">Translate</span>
            </div>
          </div>
          <div className="flex space-x-4 shrink-0 ml-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">Workout plan</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Transcribe my class notes
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Create a pros and cons list
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Morning Productivity Plan
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">
                Experience Tokyo like a local
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 transition-all duration-300 border border-[#E5E7EB] whitespace-nowrap">
              <span className="text-blue-600 font-medium">Translate</span>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default ConversationSection;
