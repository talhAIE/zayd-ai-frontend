import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface TranscriptCardProps {
  title?: string;
  transcript?: string;
}

const TranscriptCard: React.FC<TranscriptCardProps> = ({
  title = 'Transcript',
  transcript = 'Transcript content will appear here once the session starts. This is a placeholder to reserve space for the 3D mode layout.',
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [shouldShowToggle, setShouldShowToggle] = React.useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!contentRef.current) return;
    setIsExpanded(false);
    const element = contentRef.current;
    const originalClass = element.className;
    element.className = originalClass.replace('line-clamp-4', 'line-clamp-none');
    const fullHeight = element.scrollHeight;
    element.className = originalClass;
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 22;
    const maxHeight = lineHeight * 4;
    setShouldShowToggle(fullHeight > maxHeight);
  }, [transcript]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <MessageSquareText className="h-4 w-4 text-sky-600" />
        <span>{title}</span>
      </div>
      <p
        ref={contentRef}
        className={`mt-3 text-sm leading-relaxed text-slate-600 transition-all duration-300 ${
          isExpanded ? 'line-clamp-none' : 'line-clamp-4'
        }`}
      >
        {transcript
          .split(/(\*\*.*?\*\*)/g)
          .map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <span key={i} className="font-semibold text-sky-700">
                {part.slice(2, -2)}
              </span>
            ) : (
              part
            ),
          )}
      </p>
      {shouldShowToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 h-auto p-1 text-xs text-sky-600 hover:bg-sky-50"
        >
          {isExpanded ? 'See Less' : 'See More'}
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Button>
      )}
    </section>
  );
};

export default TranscriptCard;
