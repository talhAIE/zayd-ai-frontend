import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface MatchComponentProps {
  component: LearningComponent;
  onAnswerChange?: (pairs: Record<string, string>) => void;
  onSubmit?: (pairs: Record<string, string>) => void;
  isSubmitted?: boolean;
  disabled?: boolean;
}

export default function MatchComponent({
  component,
  onAnswerChange,
  onSubmit,
  isSubmitted = false,
  disabled = false,
}: MatchComponentProps) {
  const rawPairs = component.content?.matchingPairs || component.matchingLeftItems.map((left, index) => ({
    leftValue: left.value,
    rightValue: component.matchingRightItems[index]?.value || '',
  })) || [
    { leftValue: 'Numerator', rightValue: 'Top Number' },
    { leftValue: 'Denominator', rightValue: 'Bottom Number' },
  ];

  // Distinct left & right items
  const leftItems = useMemo(
    () =>
      rawPairs.map((p: any, idx: number) => ({
        id: `left-${idx}`,
        text: p.leftValue,
      })),
    [rawPairs]
  );

  const defaultRightOrder = useMemo(() => {
    return rawPairs.length === 2
      ? [rawPairs[1].rightValue, rawPairs[0].rightValue]
      : rawPairs.map((p: any) => p.rightValue);
  }, [rawPairs]);

  const rightItems = useMemo(
    () =>
      (component.content?.rightItems || defaultRightOrder).map((text: string, idx: number) => ({
        id: `right-${idx}`,
        text,
      })),
    [component.content?.rightItems, defaultRightOrder]
  );

  // State: mapping from left item text -> right item text
  const [connections, setConnections] = useState<Record<string, string>>(() => {
    if (component.attempt?.response) {
      return component.attempt.response;
    }
    // Default matching for visual fidelity if demo
    return {
      Numerator: 'Top Number',
      Denominator: 'Bottom Number',
    };
  });

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // SVG coordinate measurement
  const containerRef = useRef<HTMLDivElement>(null);
  const leftItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [svgLines, setSvgLines] = useState<Array<{ id: string; path: string; isCorrect?: boolean }>>([]);

  const updateSvgLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newLines: Array<{ id: string; path: string }> = [];

    Object.entries(connections).forEach(([leftText, rightText]) => {
      const leftEl = leftItemRefs.current[leftText];
      const rightEl = rightItemRefs.current[rightText];

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        // Right anchor of left box
        const x1 = leftRect.right - containerRect.left;
        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;

        // Left anchor of right box
        const x2 = rightRect.left - containerRect.left;
        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

        // Smooth cubic bezier curve
        const dx = (x2 - x1) * 0.5;
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        newLines.push({
          id: `${leftText}-${rightText}`,
          path,
        });
      }
    });

    setSvgLines(newLines);
  }, [connections]);

  useEffect(() => {
    updateSvgLines();
    window.addEventListener('resize', updateSvgLines);
    return () => window.removeEventListener('resize', updateSvgLines);
  }, [updateSvgLines]);

  const handleLeftClick = (text: string) => {
    if (disabled || isSubmitted) return;
    setSelectedLeft(selectedLeft === text ? null : text);
  };

  const handleRightClick = (text: string) => {
    if (disabled || isSubmitted) return;

    if (selectedLeft) {
      // Connect selectedLeft -> text
      const newConnections = { ...connections, [selectedLeft]: text };
      setConnections(newConnections);
      setSelectedLeft(null);
      onAnswerChange?.(newConnections);
      setTimeout(updateSvgLines, 50);
    } else {
      // If clicking right side that is already connected to something, allow unlinking
      const existingLeft = Object.keys(connections).find((k) => connections[k] === text);
      if (existingLeft) {
        const newConnections = { ...connections };
        delete newConnections[existingLeft];
        setConnections(newConnections);
        onAnswerChange?.(newConnections);
        setTimeout(updateSvgLines, 50);
      }
    }
  };

  const handleReset = () => {
    if (disabled || isSubmitted) return;
    setConnections({});
    setSelectedLeft(null);
    onAnswerChange?.({});
    setTimeout(updateSvgLines, 50);
  };

  const title = component.title || 'Connect the Dots';
  const subtitle = component.content?.instruction || 'Tap a term on the left, then tap its match on the right to draw a connection.';
  const badge = component.content?.badge || 'MATCHING EXERCISE';
  const tag = component.content?.tag || 'INTERACTIVE';

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-6 font-['Outfit',sans-serif] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#2563EB]">
            {badge}
          </span>
          <h2 className="text-[20px] md:text-[22px] font-bold text-[#0F172A] tracking-[-0.3px]">
            {title}
          </h2>
          <p className="text-[13px] md:text-[14px] text-[#64748B]">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {tag && (
            <div className="px-3.5 py-1 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              {tag}
            </div>
          )}
          {!isSubmitted && Object.keys(connections).length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Reset matches"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Matching Canvas & Cards Area */}
      <div 
        ref={containerRef}
        className="relative w-full py-4 min-h-[220px] flex items-center justify-between gap-8 md:gap-16"
      >
        {/* SVG Bezier Connecting Curves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          {svgLines.map((line) => (
            <g key={line.id}>
              <path
                d={line.path}
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300 drop-shadow-sm"
              />
              {/* Animated pulse dot along line */}
              <circle r="4" fill="#0D9488">
                <animateMotion dur="2.5s" repeatCount="indefinite" path={line.path} />
              </circle>
            </g>
          ))}
        </svg>

        {/* Left Column */}
        <div className="flex flex-col gap-4 w-[45%] sm:w-[40%] z-20">
          {leftItems.map((item: { id: string; text: string }) => {
            const isSelected = selectedLeft === item.text;
            const isConnected = !!connections[item.text];

            return (
              <div
                key={item.id}
                ref={(el) => (leftItemRefs.current[item.text] = el)}
                onClick={() => handleLeftClick(item.text)}
                className={`
                  rounded-[14px] p-4 md:py-4 md:px-6 flex items-center justify-center text-center font-bold text-[14px] md:text-[15px] transition-all cursor-pointer select-none
                  ${
                    isSelected
                      ? 'border-2 border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-4 ring-[#2563EB]/15 scale-[1.02] shadow-md'
                      : isConnected
                      ? 'border-2 border-[#2DD4BF] bg-[#F0FDFA] text-[#0F172A] shadow-sm'
                      : 'border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }
                `}
              >
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 w-[45%] sm:w-[40%] z-20">
          {rightItems.map((item: { id: string; text: string }) => {
            const isConnected = Object.values(connections).includes(item.text);

            return (
              <div
                key={item.id}
                ref={(el) => (rightItemRefs.current[item.text] = el)}
                onClick={() => handleRightClick(item.text)}
                className={`
                  rounded-[14px] p-4 md:py-4 md:px-6 flex items-center justify-center text-center font-bold text-[14px] md:text-[15px] transition-all cursor-pointer select-none
                  ${
                    selectedLeft
                      ? 'border-2 border-dashed border-[#2563EB] bg-[#EFF6FF]/60 text-[#1D4ED8] hover:bg-[#EFF6FF] hover:border-solid hover:scale-[1.02]'
                      : isConnected
                      ? 'border-2 border-[#2DD4BF] bg-[#F0FDFA] text-[#0F172A] shadow-sm'
                      : 'border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                  }
                `}
              >
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Submit Button */}
      {onSubmit && !isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onSubmit(connections)}
            disabled={disabled || Object.keys(connections).length === 0}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white px-6 py-2.5 rounded-[10px] font-bold text-[14px] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Connections
          </button>
        </div>
      )}
    </div>
  );
}
