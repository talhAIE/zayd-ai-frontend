import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronDown, BookOpen } from 'lucide-react';

interface ReadingPassageCardProps {
  content: string;
  audioUrl?: string;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
}

const ReadingPassageCard: React.FC<ReadingPassageCardProps> = ({
  content,
  audioUrl,
  isPlaying = false,
  onToggleAudio,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = React.useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  // Check if content needs expansion button
  useEffect(() => {
    if (contentRef.current) {
      // Reset expansion state when content changes
      setIsExpanded(false);

      // Temporarily remove line-clamp to measure full height
      const element = contentRef.current;
      const originalClass = element.className;
      element.className = originalClass.replace('line-clamp-3', 'line-clamp-none');

      const fullHeight = element.scrollHeight;

      // Restore original class
      element.className = originalClass;

      // Calculate height of 3 lines (approximate)
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 24;
      const maxHeight = lineHeight * 3;

      setShouldShowExpandButton(fullHeight > maxHeight);
    }
  }, [content]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#F0F8FF] rounded-2xl p-6 shadow-sm border-2 border-[#3EA4F9]">
      {/* Reading Passage Tag */}
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center gap-2 bg-[#3EA4F9] rounded-full px-4 py-2">
          <BookOpen className="w-4 h-4 text-[#F0F8FF]" />
          <span className="text-sm font-semibold text-[#F0F8FF] font-['Outfit']">Reading Passage</span>
        </div>
      </div>

      {/* Content */}
      <p
        ref={contentRef}
        className={`text-gray-700 text-base leading-relaxed whitespace-pre-wrap transition-all duration-300 font-['Serif'] ${
          !isExpanded ? 'line-clamp-3' : 'line-clamp-none'
        }`}
      >
        {content
          .split(/(\*\*.*?\*\*)/g)
          .map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <span key={i} className="font-bold text-[#3EA4F9] font-['Serif']">
                {part.slice(2, -2)}
              </span>
            ) : (
              part
            )
          )}
      </p>

      {/* Footer with Audio and See More */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          {audioUrl && onToggleAudio && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleAudio}
              className="text-[#3EA4F9] hover:text-[#3EA4F9] hover:bg-[#E6F3FF] p-2 h-auto font-['Serif']"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>

        {shouldShowExpandButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="text-[#3EA4F9] hover:text-[#3EA4F9] hover:bg-[#E6F3FF] p-2 h-auto flex items-center gap-1 font-['Serif']"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'See Less' : 'See More'}
            </span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReadingPassageCard;
