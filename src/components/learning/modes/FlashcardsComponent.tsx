import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface FlashcardsComponentProps {
  component: LearningComponent;
  onComplete?: () => void;
}

export default function FlashcardsComponent({ component, onComplete }: FlashcardsComponentProps) {
  const rawCards = component.content?.cards || [
    { front: 'Complex Fraction', back: 'A fraction where the numerator, denominator, or both contain a fraction.' },
    { front: 'Reciprocal', back: 'The inverted form of a fraction (e.g. 3/4 becomes 4/3).' },
  ];

  const cards = rawCards.map((c: any, idx: number) => ({
    id: c.id || `card-${idx}`,
    front: c.front || c.term || c.question || '',
    back: c.back || c.definition || c.answer || '',
    example: c.example,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsFlipped(false);
      const newViewed = new Set(viewedCards);
      newViewed.add(nextIdx);
      setViewedCards(newViewed);
      if (newViewed.size === cards.length) {
        onComplete?.();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIndex] || cards[0];

  return (
    <div className="w-full flex flex-col gap-4 font-['Outfit',sans-serif]">
      {/* 1. Hero Word Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[160px] md:min-h-[180px] rounded-[18px] bg-gradient-to-r from-[#4F8DFB] to-[#3B82F6] p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-[0px_4px_16px_rgba(79,141,251,0.2)] hover:opacity-95 transition-all relative select-none"
      >
        <h2 className="text-[32px] md:text-[38px] font-extrabold text-white tracking-[-0.5px]">
          {currentCard?.front}
        </h2>
        <span className="text-[13px] font-semibold text-white/80 mt-2 flex items-center gap-1">
          {isFlipped ? 'Click to hide ↺' : 'Click to reveal →'}
        </span>
      </div>

      {/* 2. Definition & Example Card */}
      <div className="w-full bg-white rounded-[18px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col items-center text-center gap-4 transition-all">
        <p className="text-[16px] md:text-[17px] font-bold text-[#15803D] leading-relaxed max-w-[650px]">
          {currentCard?.back}
        </p>

        {currentCard?.example && (
          <div className="w-full max-w-[650px] py-2.5 px-4 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] font-semibold text-[14px] shadow-sm">
            Ex: {currentCard.example.replace(/^Ex:\s*/i, '')}
          </div>
        )}
      </div>

      {/* Card Navigation Controls (if multiple vocabulary words exist) */}
      {cards.length > 1 && (
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-[10px] border border-[#E2E8F0] bg-white font-semibold text-[13px] text-[#475569] hover:bg-gray-50 flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Word
          </button>

          <span className="text-[12px] font-bold text-[#949494]">
            Word {currentIndex + 1} of {cards.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="px-4 py-2 rounded-[10px] bg-[#4F8DFB] hover:bg-[#3B82F6] text-white font-semibold text-[13px] flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            Next Word <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
