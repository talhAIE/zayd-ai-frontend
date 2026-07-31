import React, { useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, BookOpen } from 'lucide-react';

interface ReadingPassageCardProps {
  content: string;
  audioUrl?: string;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
  onExpand?: () => void;
  forceExpanded?: boolean;
}

const ReadingPassageCard: React.FC<ReadingPassageCardProps> = ({
  content,
  audioUrl,
  isPlaying = false,
  onToggleAudio,
  onExpand,
  forceExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = React.useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // Check if content needs expansion button
  useEffect(() => {
    if (contentRef.current) {
      setIsExpanded(false);

      const element = contentRef.current;
      const originalClass = element.className;
      element.className = originalClass.replace('line-clamp-3', 'line-clamp-none');

      const fullHeight = element.scrollHeight;
      element.className = originalClass;

      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 22;
      const maxHeight = lineHeight * 3;

      setShouldShowExpandButton(fullHeight > maxHeight);
    }
  }, [content]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-[12px] p-[16px_20px] flex flex-col gap-3 font-['Outfit',sans-serif]">
      {/* Header Row: Badge & Audio */}
      <div className="flex flex-row justify-between items-center w-full">
        {/* Reading Passage Badge */}
        <div className="inline-flex flex-row items-center px-3 py-1.5 gap-[6px] bg-[#EFF6FF] border border-[#5C9DFF] rounded-[20px]">
          <BookOpen className="w-3.5 h-3.5 text-[#5C9DFF]" />
          <span className="font-['Outfit'] font-semibold text-[12px] leading-[15px] text-[#5C9DFF]">
            Reading Passage
          </span>
        </div>

        {audioUrl && onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="flex items-center gap-1.5 text-[#5C9DFF] hover:text-[#4A8BEB] transition-colors p-1"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="text-[12px] font-semibold">Listen</span>
          </button>
        )}
      </div>

      {/* Content */}
      <p
        ref={contentRef}
        className={`font-['Outfit'] font-normal text-[14px] leading-[22px] text-[#282828] whitespace-pre-wrap transition-all duration-200 ${
          (!isExpanded && !forceExpanded) ? 'line-clamp-3' : 'line-clamp-none'
        }`}
      >
        {content
          .split(/(\*\*.*?\*\*)/g)
          .map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <span key={i} className="font-semibold text-[#5C9DFF]">
                {part.slice(2, -2)}
              </span>
            ) : (
              part
            )
          )}
      </p>

      {/* See More Row */}
      {(shouldShowExpandButton && !forceExpanded) && (
        <div className="flex flex-row items-center pt-1">
          <button
            onClick={handleToggleExpand}
            className="font-['Outfit'] font-semibold text-[13px] leading-[16px] text-[#5C9DFF] underline hover:text-[#4A8BEB] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{isExpanded ? 'See Less' : 'See More'}</span>
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingPassageCard;
