import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface FlashcardsComponentProps {
  component: LearningComponent;
  onSubmit?: (response: { viewedCardIds: string[] }) => Promise<unknown> | void;
  isSubmitted?: boolean;
}

export default function FlashcardsComponent({ component, onSubmit, isSubmitted = false }: FlashcardsComponentProps) {
  const rawCards = Array.isArray(component.content?.cards) ? component.content.cards : [];
  const cards = rawCards.map((card: any, index: number) => ({
    id: card.id || `card-${index}`,
    front: card.front || card.term || card.question || '',
    back: card.back || card.definition || card.answer || '',
    example: card.example,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const currentCard = cards[currentIndex] || cards[0];

  const flipCard = () => {
    if (!currentCard) return;

    setIsFlipped((wasFlipped) => {
      const willShowAnswer = !wasFlipped;
      if (willShowAnswer) {
        setViewedCards((previous) => new Set([...previous, currentCard.id]));
      }
      return willShowAnswer;
    });
  };

  const changeCard = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
  };

  if (!cards.length) {
    return <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">This flashcard activity has no valid learner cards.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4 font-['Outfit',sans-serif]">
      <div className="flex items-center justify-between px-1 text-[12px] font-semibold text-[#64748B]">
        <span>{isFlipped ? 'Answer revealed' : 'Tap the card to reveal the answer'}</span>
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 font-bold text-[#2563EB]">{currentIndex + 1} of {cards.length}</span>
      </div>

      <div className="mx-auto w-full max-w-[760px] [perspective:1200px]">
        <button
          type="button"
          onClick={flipCard}
          aria-pressed={isFlipped}
          aria-label={isFlipped ? 'Show the question side of this flashcard' : 'Show the answer side of this flashcard'}
          className="group block w-full rounded-[18px] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30"
        >
          <div className={`relative h-[230px] w-full transition-transform duration-500 [transform-style:preserve-3d] sm:h-[250px] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute inset-0 flex [backface-visibility:hidden] flex-col items-center justify-center rounded-[18px] bg-gradient-to-br from-[#4F8DFB] to-[#2563EB] p-7 text-center shadow-[0px_8px_24px_rgba(37,99,235,0.22)] sm:p-9">
              <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Question</span>
              <h2 className="max-w-[650px] text-[21px] font-extrabold leading-snug tracking-[-0.35px] text-white sm:text-[27px]">
                {currentCard?.front}
              </h2>
              <span className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-white/85 transition-transform group-hover:translate-y-0.5">
                Tap to reveal answer <ChevronRight className="h-4 w-4" />
              </span>
            </div>

            <div className="absolute inset-0 flex [backface-visibility:hidden] [transform:rotateY(180deg)] flex-col items-center justify-center rounded-[18px] border border-[#99F6E4] bg-[#F0FDFA] p-7 text-center shadow-[0px_8px_24px_rgba(13,148,136,0.15)] sm:p-9">
              <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F766E]">Answer</span>
              <p className="max-w-[650px] text-[16px] font-bold leading-relaxed text-[#115E59] sm:text-[18px]">
                {currentCard?.back}
              </p>
              {currentCard?.example && (
                <p className="mt-4 max-w-[620px] rounded-[10px] border border-[#99F6E4] bg-white/80 px-4 py-2 text-[13px] font-semibold text-[#0F766E]">
                  Example: {currentCard.example.replace(/^Ex:\s*/i, '')}
                </p>
              )}
              <span className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-[#0F766E]">
                <RotateCcw className="h-3.5 w-3.5" /> Tap to see question
              </span>
            </div>
          </div>
        </button>
      </div>

      {cards.length > 1 && (
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => changeCard(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex cursor-pointer items-center gap-1 rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#475569] shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <span className="text-[12px] font-bold text-[#64748B]">{viewedCards.size} of {cards.length} reviewed</span>

          <button
            type="button"
            onClick={() => changeCard(currentIndex + 1)}
            disabled={currentIndex === cards.length - 1}
            className="flex cursor-pointer items-center gap-1 rounded-[10px] bg-[#4F8DFB] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {onSubmit && !isSubmitted && (
        <div className="mx-auto flex w-full max-w-[760px] justify-end">
          <button
            type="button"
            onClick={() => onSubmit({ viewedCardIds: [...viewedCards] })}
            disabled={viewedCards.size !== cards.length}
            className="rounded-[10px] bg-[#4F8DFB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete flashcards
          </button>
        </div>
      )}
    </div>
  );
}
