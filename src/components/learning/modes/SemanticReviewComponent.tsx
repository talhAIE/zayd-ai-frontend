import { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface SemanticReviewComponentProps {
  component: LearningComponent;
  onAnswerChange?: (text: string) => void;
  onSubmit?: (text: string) => Promise<any> | void;
  isSubmitted?: boolean;
  disabled?: boolean;
}

export default function SemanticReviewComponent({
  component,
  onAnswerChange,
  onSubmit,
  isSubmitted = false,
  disabled = false,
}: SemanticReviewComponentProps) {
  const prompt =
    component.content?.prompt ||
    component.description ||
    component.title ||
    '';

  const minimumCharacters = component.content?.minimumCharacters || 10;
  const placeholder = component.content?.placeholder || '';

  const [text, setText] = useState<string>(() => {
    if (component.attempt?.response?.text) {
      return String(component.attempt.response.text);
    }
    if (component.attempt?.response?.response) {
      return String(component.attempt.response.response);
    }
    return '';
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(() => {
    if (component.attempt?.feedback) {
      return component.attempt.feedback;
    }
    return null;
  });

  const handleChange = (val: string) => {
    if (disabled || isSubmitted) return;
    setText(val);
    onAnswerChange?.(val);
  };

  const handleAnalyze = async () => {
    if (disabled || isSubmitted || text.trim().length < minimumCharacters) return;
    setIsAnalyzing(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(text);
        if (result?.feedback) {
          setFeedback(result.feedback);
        }
      }
    } catch (err) {
      console.error('Semantic review error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isReady = text.trim().length >= minimumCharacters;

  if (!prompt) {
    return <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">This open-input activity has no valid learner prompt.</div>;
  }

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-5 font-['Outfit',sans-serif] transition-all">
      {/* Header with AI badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] font-bold text-[13px] flex items-center justify-center shadow-sm flex-shrink-0">
          AI
        </div>
        <h2 className="text-[18px] md:text-[20px] font-bold text-[#0F172A] tracking-[-0.3px]">
          Zayd Semantic Review
        </h2>
      </div>

      {/* Sub-header & Prompt */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#0284C7]">
          AI REVIEW
        </span>
        <p className="text-[14px] md:text-[15px] font-medium text-[#0284C7] leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Textarea */}
      <div className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled || isSubmitted || isAnalyzing}
          placeholder={placeholder}
          className="w-full rounded-[14px] border border-[#CBD5E1] p-4 text-[#0F172A] text-[14px] placeholder-[#94A3B8] focus:border-[#4F8DFB] focus:ring-4 focus:ring-[#4F8DFB]/15 outline-none transition-all min-h-[140px] resize-y disabled:bg-gray-50 disabled:cursor-not-allowed"
        />

        <div className="flex justify-between items-center text-[12px] text-[#94A3B8] px-1">
          <span>
            {minimumCharacters > 0 && (
              <>Min characters: {minimumCharacters} {text.length < minimumCharacters && `(${minimumCharacters - text.length} remaining)`}</>
            )}
          </span>
          <span>{text.length} chars</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-start pt-1">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={disabled || !isReady || isAnalyzing || isSubmitted}
          className={`
            rounded-full bg-[#4F8DFB] hover:bg-[#3B82F6] active:scale-[0.98] text-white px-6 py-3 font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-sm
            ${(!isReady || disabled || isSubmitted || isAnalyzing) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isAnalyzing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#FDE047] fill-[#FDE047]" />
          )}
          <span>{isAnalyzing ? 'Analyzing response...' : isSubmitted ? 'Analyzed' : 'Analyze with Zayd AI'}</span>
        </button>
      </div>

      {/* Feedback Card if present */}
      {(feedback || (isSubmitted && component.attempt?.feedback)) && (
        <div className="mt-2 p-4 rounded-[14px] bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-[#16A34A] font-bold text-[14px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI Review Feedback</span>
          </div>
          <p className="text-[13px] text-[#166534] leading-relaxed">
            {typeof feedback === 'string' ? feedback : feedback?.comment || component.attempt?.feedback || 'Great job! Your explanation demonstrated clear understanding.'}
          </p>
        </div>
      )}
    </div>
  );
}
