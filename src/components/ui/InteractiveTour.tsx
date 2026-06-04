import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  image?: string;
}

interface InteractiveTourProps {
  active: boolean;
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export default function InteractiveTour({
  active,
  steps,
  onComplete,
  onSkip,
}: InteractiveTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const currentStep = steps[currentStepIdx];

  // Helper to update the bounding rect of the target element
  const updateRect = () => {
    if (!currentStep) return;
    const element = document.getElementById(currentStep.targetId);
    if (element) {
      setRect(element.getBoundingClientRect());
    } else {
      setRect(null);
    }
  };

  // Scroll to element and measure it
  useEffect(() => {
    if (!active || !currentStep) return;

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
  }, [currentStepIdx, active]);

  // Update rect on resize and scroll
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true); // Catch inside scroll containers
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, currentStepIdx]);

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

    let position = currentStep.position;
    
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
      <div className="fixed inset-0 bg-black/60 pointer-events-auto transition-opacity duration-300" />

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
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="w-[340px] bg-white rounded-[20px] pointer-events-auto z-[102] flex flex-col items-center mb-[24px]"
      >
        <div
          style={{
            boxShadow:
              "0px 2px 12px rgba(92, 157, 255, 0.12), 0px 12px 48px rgba(28, 32, 58, 0.2)",
          }}
          className="w-full flex flex-col rounded-[20px] overflow-hidden pb-[24px]"
        >
          {/* Top Section */}
          <div
            className="w-full h-[156px] relative flex flex-col items-center justify-between p-3"
            style={{
              background:
                "linear-gradient(135deg, #EDF2FF 70.71%, #D6EAFF 38.89%, #EEF4FF 0%)",
            }}
          >
            {/* Top Bar with Step Pill */}
            <div className="w-[316px] flex justify-end">
              <div className="flex items-center justify-center px-4 py-1.5 gap-2.5 bg-white/90 shadow-[0_1px_6px_rgba(92,157,255,0.15)] rounded-full">
                <span className="font-bold text-[11px] leading-[16px] text-[#5C9DFF]">
                  {currentStepIdx + 1} / {steps.length}
                </span>
              </div>
            </div>

            {/* Mascot Image */}
            <div className="absolute bottom-0 w-[144px] h-[144px] pointer-events-none filter drop-shadow-[0_4px_20px_rgba(92,157,255,0.22)]">
              {/* Fallback to generic bird or use TeachBird from assets if imported */}
              {/* Because this component might not import TeachBird directly, I'll use a placeholder or import it.
                  I'll use an img tag pointing to the bird asset. */}
              <img
                src={currentStep.image || "/src/assets/svgs/dashboardTeach.svg"}
                alt="Mascot"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if path doesn't match
                  (e.target as HTMLImageElement).src =
                    "https://api.iconify.design/twemoji:bird.svg";
                }}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-4 pt-4 px-6 w-full">
            {/* Text content */}
            <div className="flex flex-col items-start gap-[6px] w-full min-h-[72px]">
              <h4 className="font-extrabold text-[18px] leading-[22px] tracking-[-0.2px] text-[#333333]">
                {currentStep.title}
              </h4>
              <p className="font-normal text-[14px] leading-[22px] text-[#434343] line-clamp-2">
                {currentStep.description}
              </p>
            </div>

            {/* Progress bar and dots container */}
            <div className="flex flex-col w-full gap-4 pt-2">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-[#6E7496]/10 rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIdx + 1) / steps.length) * 100}%`,
                    background:
                      "linear-gradient(90deg, #5C9DFF 100%, #6EBDFB 0%)",
                  }}
                />
              </div>

              {/* Dots */}
              <div className="flex justify-center items-center gap-[6px]">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[6px] rounded-full transition-all duration-300 ${
                      i === currentStepIdx ? "w-[18px]" : "w-[6px] opacity-20"
                    }`}
                    style={{
                      background:
                        i === currentStepIdx
                          ? "linear-gradient(90deg, #5C9DFF 100%, #6EBDFB 0%)"
                          : "#6E7496",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div
        className="fixed bottom-0 left-0 w-full h-[79px] flex items-center justify-between px-8 z-[103] pointer-events-auto"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0px -4px 24px rgba(28, 32, 58, 0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <button
          onClick={onSkip}
          className="font-medium text-[14px] text-[#6E7496] hover:text-[#434343] transition-colors"
        >
          Skip Tour
        </button>

        <div className="flex gap-4">
          {currentStepIdx > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-1 px-6 py-2.5 font-bold text-[14px] text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-8 py-2.5 font-bold text-[14px] text-white rounded-xl active:scale-95 transition-all shadow-[0_4px_12px_rgba(92,157,255,0.3)]"
            style={{
              background: "linear-gradient(180deg, #6EBDFB 0%, #5C9DFF 100%)",
            }}
          >
            <span>
              {currentStepIdx === steps.length - 1 ? "Finish" : "Next"}
            </span>
            {currentStepIdx < steps.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

