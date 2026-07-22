import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTopicItem } from "@/pages/student/topics/PhotoModeTopics";

interface PhotoModeCompletionProps {
  topic: DemoTopicItem;
  onBackToTopics: () => void;
  onNextTopic?: () => void;
}

export const PhotoModeCompletion: React.FC<PhotoModeCompletionProps> = ({
  topic,
  onBackToTopics,
  onNextTopic,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-6 font-outfit">
      {/* Main Inner Card Container (matching photo-mode-topic-complete.css) */}
      <div className="w-full bg-white rounded-[24px] p-8 sm:p-12 shadow-[0px_4px_16px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col items-center justify-center gap-8 text-center">
        {/* Celebration Hero */}
        <div className="flex flex-col items-center gap-4">
          {/* Trophy / Medal Badge */}
          <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-[#5C9DFF]/10 text-[#5C9DFF]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M29.855 4.66699H25.1883C20.7876 4.66699 18.5873 4.66699 17.2223 6.03433C15.855 7.40166 15.855 9.59966 15.855 14.0003V22.167H39.1883V14.0003C39.1883 9.59966 39.1883 7.40166 37.821 6.03433C36.4536 4.66699 34.2556 4.66699 29.855 4.66699Z"
                fill="#5C9DFF"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M30.8702 13.4937C29.8423 12.9333 28.6902 12.6396 27.5195 12.6396C26.3488 12.6396 25.1967 12.9333 24.1688 13.4937L12.9828 19.593C11.8785 20.1951 10.9568 21.0836 10.3146 22.1651C9.6724 23.2466 9.33349 24.4812 9.3335 25.739V37.261C9.33349 38.5188 9.6724 39.7534 10.3146 40.8349C10.9568 41.9164 11.8785 42.8049 12.9828 43.407L24.1688 49.5063C25.1967 50.0667 26.3488 50.3604 27.5195 50.3604C28.6902 50.3604 29.8423 50.0667 30.8702 49.5063L42.0585 43.407C43.1628 42.8049 44.0846 41.9164 44.7268 40.8349C45.3689 39.7534 45.7078 38.5188 45.7078 37.261V25.7367C45.7078 24.4789 45.3689 23.2443 44.7268 22.1628C44.0846 21.0812 43.1628 20.1927 42.0585 19.5907L30.8702 13.4937ZM27.5195 24.5C26.8568 24.5 26.4135 25.2933 25.5268 26.887L25.2982 27.2977C25.0462 27.7503 24.9202 27.9743 24.7242 28.1237C24.5282 28.273 24.2808 28.329 23.7932 28.4387L23.3498 28.5413C21.6255 28.931 20.7645 29.1247 20.5615 29.7827C20.3562 30.443 20.9418 31.129 22.1155 32.501L22.4188 32.8557C22.7548 33.2453 22.9205 33.439 22.9952 33.6817C23.0698 33.9243 23.0465 34.1833 22.9952 34.7037L22.9485 35.1773C22.7712 37.009 22.6825 37.926 23.2192 38.332C23.7558 38.738 24.5608 38.367 26.1732 37.625L26.5908 37.4337C27.0482 37.2237 27.2768 37.1187 27.5195 37.1187C27.7622 37.1187 27.9932 37.2237 28.4505 37.4337L28.8682 37.625C30.4782 38.3693 31.2855 38.738 31.8222 38.332C32.3588 37.926 32.2702 37.009 32.0928 35.1773L32.0462 34.7037C31.9948 34.1833 31.9692 33.9243 32.0462 33.6817C32.1208 33.4413 32.2865 33.2453 32.6202 32.8557L32.9235 32.501C34.0995 31.129 34.6852 30.443 34.4798 29.7827C34.2745 29.1247 33.4135 28.931 31.6938 28.5413L31.2482 28.4387C30.7582 28.329 30.5132 28.2753 30.3172 28.1237C30.1212 27.9743 29.9952 27.7503 29.7432 27.2977L29.5145 26.887C28.6278 25.2957 28.1845 24.5 27.5195 24.5Z"
                fill="#5C9DFF"
              />
            </svg>
          </div>

          {/* Title Group */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-outfit font-extrabold text-[32px] leading-[40px] text-[#0F1450]">
              Topic Completed!
            </h1>
            <span className="font-outfit font-semibold text-[16px] leading-[20px] text-[#5C9DFF]">
              {topic.topicName}
            </span>
          </div>

        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[460px]">
          {/* Stat 1: Sentences Completed */}
          <div className="flex flex-col items-center justify-center gap-2 bg-[#F0F4FA] rounded-[16px] p-5">
            <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#6E748F] uppercase tracking-wider">
              SENTENCES COMPLETED
            </span>
            <span className="font-outfit font-extrabold text-[24px] leading-[30px] text-[#0F1450]">
              10 / 10
            </span>
          </div>

          {/* Stat 2: Total Time */}
          <div className="flex flex-col items-center justify-center gap-2 bg-[#F0F4FA] rounded-[16px] p-5">
            <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#6E748F] uppercase tracking-wider">
              TOTAL TIME
            </span>
            <span className="font-outfit font-extrabold text-[24px] leading-[30px] text-[#0F1450]">
              8 Minutes
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[400px] pt-2">
          {/* Back to Topics Button */}
          <button
            onClick={onBackToTopics}
            className="w-full sm:w-1/2 h-[47px] px-6 bg-white border border-[#6E748F] rounded-[12px] font-outfit font-semibold text-[15px] leading-[19px] text-[#6E748F] hover:bg-gray-50 transition-colors"
          >
            Back to Topics
          </button>

          {/* Next Topic Button */}
          <Button
            onClick={onNextTopic || onBackToTopics}
            className="w-full sm:w-1/2 h-[47px] px-6 bg-[#5C9DFF] hover:bg-blue-600 text-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] flex items-center justify-center gap-2 shadow-none transition-all"
          >
            <span>Next Topic</span>
            <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoModeCompletion;
