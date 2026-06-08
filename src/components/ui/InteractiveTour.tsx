import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TourStep {
  targetId?: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  image?: string;
  buttonText?: string;
  onNextAction?: () => void;
  isNextDisabled?: boolean;
}

interface InteractiveTourProps {
  active: boolean;
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  variant?: "default" | "modal";
}

export default function InteractiveTour({
  active,
  steps,
  onComplete,
  onSkip,
  variant = "default",
}: InteractiveTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const currentStep = steps[currentStepIdx];

  // Helper to update the bounding rect of the target element
  const updateRect = () => {
    if (!currentStep || !currentStep.targetId) return;
    const element = document.getElementById(currentStep.targetId);
    if (element) {
      setRect(element.getBoundingClientRect());
    } else {
      setRect(null);
    }
  };

  // Scroll to element and measure it
  useEffect(() => {
    if (!active || !currentStep || !currentStep.targetId) return;

    const element = document.getElementById(currentStep.targetId);
    if (element) {
      // Scroll into view smoothly
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // Polling to wait for scroll to settle
      const interval = setInterval(() => {
        const currentRect = element.getBoundingClientRect();
        // Update rect state
        setRect(currentRect);
      }, 50);

      // Settle after 600ms
      const timeout = setTimeout(() => {
        clearInterval(interval);
        updateRect();
      }, 600);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setRect(null);
    }
  }, [currentStepIdx, active, currentStep?.targetId]);

  // Update rect on resize and scroll
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true); // Catch inside scroll containers
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, currentStepIdx, currentStep?.targetId]);

  // Position the tooltip card relative to the spotlight rect
  useEffect(() => {
    if (!rect || !tooltipRef.current || !currentStep) return;

    const tooltipEl = tooltipRef.current;
    const tooltipWidth = tooltipEl.offsetWidth;
    const tooltipHeight = tooltipEl.offsetHeight;

    const padding = 12; // spotlight padding
    const gap = 16; // space between spotlight and tooltip

    const spotlight = {
      top: rect.top - padding,
      bottom: rect.bottom + padding,
      left: rect.left - padding,
      right: rect.right + padding,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };

    let top = 0;
    let left = 0;

    let position = currentStep.position || "right";
    
    // User requested never above or beneath, always left or right
    if (position === "top" || position === "bottom") {
      position = "right";
    }

    // Auto-flip to left if right overflows
    if (position === "right" && spotlight.right + gap + tooltipWidth > window.innerWidth) {
      position = "left";
    }
    // Auto-flip to right if left overflows
    if (position === "left" && spotlight.left - gap - tooltipWidth < 0) {
      position = "right";
    }

    switch (position) {
      case "left":
        top = spotlight.centerY - tooltipHeight / 2;
        left = spotlight.left - tooltipWidth - gap;
        // Safety checks to prevent horizontal and vertical overflow
        left = Math.max(16, left);
        top = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, top));
        break;

      case "right":
        top = spotlight.centerY - tooltipHeight / 2;
        left = spotlight.right + gap;
        // Safety checks to prevent horizontal and vertical overflow
        left = Math.min(window.innerWidth - tooltipWidth - 16, left);
        top = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, top));
        break;
    }

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      transition: "top 0.2s ease-out, left 0.2s ease-out",
    });
  }, [rect, currentStepIdx, active]);

  if (!active || !currentStep) return null;

  const handleNext = () => {
    if (currentStep.onNextAction) {
      currentStep.onNextAction();
      return;
    }
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const padding = 12;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none font-['Outfit'] select-none">
      {/* Darkened Screen Backdrop (Click Blocker) */}
      <div className="fixed inset-0 bg-black/60 pointer-events-none transition-opacity duration-300" />

      {/* Spotlight highlight */}
      {rect && (
        <div
          className="fixed border-2 border-[#047EE9] shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] rounded-2xl pointer-events-none transition-all duration-300 ease-out z-[101]"
          style={{
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
          }}
        >
        </div>
      )}

      {/* Tooltip Card */}
      {variant === "modal" ? (
        <div
          ref={tooltipRef}
          style={{
            ...tooltipStyle,
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.15)",
          }}
          className="w-[340px] h-auto bg-white rounded-[24px] overflow-hidden z-[102] max-w-[90vw] pointer-events-auto flex flex-col"
        >
          {/* Top Section */}
          <div className="flex flex-row items-start px-[24px] pt-[40px] gap-[10px] w-full min-h-[180px] bg-[#F3F4F6] relative">
            {/* Text Content */}
            <div className="flex flex-col items-start gap-[6px] w-[55%] z-10 shrink-0">
              <h2 className="font-bold text-[22px] leading-[28px] tracking-[-0.3px] text-[#333333] w-full">
                {currentStep.title}
              </h2>
              <p className="font-normal text-[14px] leading-[20px] text-[#434343] w-full mt-2 whitespace-pre-wrap">
                {currentStep.description}
              </p>
            </div>

            {/* Mascot Image */}
            <div className="flex flex-col items-start gap-[10px] w-[140px] h-[130px] rounded-tl-[24px] absolute right-0 bottom-0 pointer-events-none">
              <img
                src={currentStep.image || "/src/assets/svgs/dashboardTeach.svg"}
                alt="Mascot"
                className="w-full h-full object-contain object-bottom"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://api.iconify.design/twemoji:bird.svg";
                }}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center px-[24px] py-[20px] gap-[16px] w-full bg-white relative z-10">
            <button
              onClick={handleNext}
              disabled={currentStep.isNextDisabled}
              className={`flex flex-row justify-center items-center py-[12px] px-[20px] w-full max-w-full h-[48px] rounded-[12px] transition-all ${
                currentStep.isNextDisabled
                  ? "bg-gray-300 cursor-not-allowed opacity-60"
                  : "hover:brightness-110 active:scale-95"
              }`}
              style={{
                background: currentStep.isNextDisabled ? undefined : "linear-gradient(180deg, #6EBDFB 0%, #5C9DFF 100%), #5C9DFF",
                boxShadow: currentStep.isNextDisabled ? undefined : "0px 4px 18px rgba(98, 80, 233, 0.22)",
              }}
            >
              <span className="font-bold text-[16px] leading-[24px] tracking-[0.15px] text-white text-center">
                {currentStep.buttonText || "Next"}
              </span>
            </button>

            {/* Dots */}
            <div className="flex flex-row items-center gap-[8px]">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-[5px] rounded-full transition-all duration-300 ${
                    i === currentStepIdx ? "w-[28px]" : "w-[8px]"
                  }`}
                  style={{
                    background:
                      i === currentStepIdx
                        ? "#5C9DFF"
                        : "rgba(110, 116, 150, 0.18)",
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Skip Button */}
          <button 
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
          >
            <span className="text-sm font-medium">Skip</span>
          </button>
        </div>
      ) : (
        <div
          ref={tooltipRef}
          style={{
            ...tooltipStyle,
            boxShadow: "0px 2px 12px rgba(92, 157, 255, 0.12), 0px 12px 48px rgba(28, 32, 58, 0.2)",
          }}
          className="w-[340px] bg-white rounded-[20px] pointer-events-auto z-[102] flex flex-col overflow-hidden pb-6"
        >
          {/* Top Section (Gradient) */}
          <div
            className="w-full relative flex flex-col p-3 shrink-0 min-h-[156px] h-auto"
            style={{
              background: "linear-gradient(135deg, #EDF2FF 70.71%, #D6EAFF 38.89%, #EEF4FF 0%)",
            }}
          >
            {/* Top Bar with Step Pill */}
            <div className="w-full flex justify-end px-1 shrink-0">
              <div className="flex items-center justify-center px-4 py-1.5 gap-2.5 bg-white/90 shadow-[0_1px_6px_rgba(92,157,255,0.15)] rounded-full">
                <span className="font-bold text-[11px] leading-[16px] text-[#5C9DFF]">
                  {currentStepIdx + 1} / {steps.length}
                </span>
              </div>
            </div>

            <div className="flex-1 flex justify-between items-center w-full px-2 relative py-2">
              {/* Text content */}
              <div className="flex flex-col items-start gap-1 w-[190px] z-10">
                <h4 className="font-bold text-[15px] leading-[20px] text-[#333333]">
                  {currentStep.title}
                </h4>
                <p className="font-normal text-[13px] leading-[18px] text-[#6E7496] whitespace-pre-wrap">
                  {currentStep.description}
                </p>
              </div>

              {/* Mascot Image */}
              <div className="absolute right-0 w-[110px] h-[110px] pointer-events-none filter drop-shadow-[0_4px_20px_rgba(92,157,255,0.22)] flex items-center justify-center">
                <img
                  src={currentStep.image || "/src/assets/svgs/dashboardTeach.svg"}
                  alt="Mascot"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://api.iconify.design/twemoji:bird.svg";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Section (Controls) */}
          <div className="flex flex-col items-center w-full gap-5 pt-5 px-6">
            <div className="flex items-center justify-between w-full">
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={currentStepIdx === 0}
                className={`flex items-center justify-center w-10 h-10 bg-white border-2 border-[#E5E7EB] rounded-[10px] transition-all ${
                  currentStepIdx === 0
                    ? "opacity-0 pointer-events-none"
                    : "hover:bg-gray-50 active:scale-95"
                }`}
              >
                <ChevronLeft className="w-5 h-5 text-[#6E7496]" />
              </button>

              {/* Dots */}
              <div className="flex justify-center items-center gap-[6px]">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[5px] rounded-full transition-all duration-300 ${
                      i === currentStepIdx ? "w-[28px]" : "w-[8px]"
                    }`}
                    style={{
                      background:
                        i === currentStepIdx
                          ? "linear-gradient(0deg, #5C9DFF, #5C9DFF)"
                          : "rgba(110, 116, 150, 0.18)",
                    }}
                  />
                ))}
              </div>

              {/* Next/Finish Button */}
              <button
                onClick={handleNext}
                disabled={currentStep.isNextDisabled}
                className={`flex items-center justify-center w-10 h-10 rounded-[10px] shadow-[0_4px_12px_rgba(98,80,233,0.18)] transition-all ${
                  currentStep.isNextDisabled ? "bg-gray-300 cursor-not-allowed" : "active:scale-95"
                }`}
                style={{
                  background: currentStep.isNextDisabled ? undefined : "linear-gradient(180deg, #6EBDFB 0%, #5C9DFF 100%)",
                }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <button
              onClick={onSkip}
              className="font-medium text-[13px] leading-[20px] tracking-[0.13px] text-[#6E7496] hover:text-[#434343] transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

