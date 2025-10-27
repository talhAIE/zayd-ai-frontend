import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import pointingSvg from "@/assets/images/landingpage/pointing.svg";
import parrotTailPng from "@/assets/images/landingpage/parrottail.png";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen text-center py-20 relative px-3 bg-white"
    >
      <p className="uppercase text-sm text-gray-500 font-semibold tracking-wide mb-3">
        Zayd AI — Unleash the Power of AI
      </p>

      {/* Relative container for parrot and tail */}
      <div className="relative inline-block">
        <h1 className="text-7xl font-bold text-gray-900 mb-6 inline-block">
          Unlock the Future <br />
          of English{" "}
          <span
            className="bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] bg-clip-text text-transparent sm:inline-flex hidden items-center"
            style={{ lineHeight: "1.2" }}
          >
            Learning
          </span>
        </h1>
      </div>

      <div className="absolute top-[12rem] right-[13rem] sm:flex hidden">
        <img src={pointingSvg} alt="Pointing" width={200} height={200} />
        {/* Tail image */}
        <img
          className="absolute top-[7rem] left-[10rem]"
          src={parrotTailPng}
          alt="Parrot Tail"
          width={400}
          height={400}
        />
      </div>

      <p className="font-normal text-[20px] leading-[24px] tracking-[0px] text-gray-600 text-center mx-auto mb-10 max-w-2xl">
        AI-powered English courses designed for Arab learners. <br />
        Interactive, personalized, and culturally relevant education for
        students grades 4-12.
      </p>

      {/* Buttons with icons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
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
      </div>

      <p className="text-blue-500 text-sm pt-10">Join thousands of students</p>
    </section>
  );
}
