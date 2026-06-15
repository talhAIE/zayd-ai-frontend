import TeachBird from "@/assets/svgs/dashboardTeach.svg";

interface TourWelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export default function TourWelcomeModal({
  isOpen,
  onStart,
  onSkip,
}: TourWelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-['Outfit'] select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onSkip}
      />

      {/* Modal Container */}
      <div className="relative flex flex-col w-[520px] rounded-[24px] overflow-hidden shadow-2xl z-10 bg-white">
        {/* Top Section */}
        <div className="relative flex flex-col justify-center items-start p-8 bg-[#F3F4F6] min-h-[259px] overflow-visible">
          {/* Text Content */}
          <div className="flex flex-col gap-2 w-[300px] z-10">
            <h2 className="text-[32px] leading-[33px] font-extrabold text-[#333333] tracking-[-0.3px] text-left">
              Welcome to Zayd AI!
            </h2>
            <p className="text-[16px] leading-[24px] font-normal text-[#434343] mt-2">
              Let me show you around so you can start your English learning
              journey.
            </p>
          </div>

          {/* Bird Image */}
          <div className="absolute right-[-20px] top-[20px] w-[224px] h-[217px] z-0 pointer-events-none">
            <img
              src={TeachBird}
              alt="Mascot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center px-10 py-6 gap-[25px] bg-white">
          <div className="flex flex-col items-center gap-[18px] w-full">
            {/* Start Tour Button */}
            <button
              onClick={onStart}
              className="flex justify-center items-center w-full h-[51px] rounded-[12px] transition-transform active:scale-95 hover:brightness-105"
              style={{
                background: "linear-gradient(180deg, #6EBDFB 0%, #5C9DFF 100%)",
                boxShadow: "0px 4px 18px rgba(98, 80, 233, 0.22)",
              }}
            >
              <span className="font-bold text-[18px] leading-[22px] tracking-[0.15px] text-white">
                🚀 Start Tour
              </span>
            </button>

            {/* Skip Button */}
            <button
              onClick={onSkip}
              className="font-medium text-[13px] leading-[20px] tracking-[0.13px] text-[#6E7496] hover:text-[#4a4e69] transition-colors"
            >
              Skip for now
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex flex-row items-center gap-[8px]">
            <div
              className="w-[28px] h-[5px] rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, #6EBDFB 0%, #5C9DFF 100%), linear-gradient(90deg, #69BDFF 100%, #6250E9 0%)",
              }}
            />
            <div className="w-[8px] h-[5px] rounded-full bg-[#6E7496] opacity-[0.18]" />
            <div className="w-[8px] h-[5px] rounded-full bg-[#6E7496] opacity-[0.18]" />
            <div className="w-[8px] h-[5px] rounded-full bg-[#6E7496] opacity-[0.18]" />
          </div>
        </div>
      </div>
    </div>
  );
}
