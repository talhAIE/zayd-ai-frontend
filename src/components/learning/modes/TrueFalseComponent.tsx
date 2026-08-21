import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface TrueFalseComponentProps {
  component: LearningComponent;
  onAnswerChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  isSubmitted?: boolean;
  disabled?: boolean;
}

export default function TrueFalseComponent({
  component,
  onAnswerChange,
  onSubmit,
  isSubmitted = false,
  disabled = false,
}: TrueFalseComponentProps) {
  const prompt =
    component.content?.prompt ||
    component.title ||
    '';

  const trueOption = component.options.find((option) => option.value === 'true' || option.label.toLowerCase() === 'true');
  const falseOption = component.options.find((option) => option.value === 'false' || option.label.toLowerCase() === 'false');
  const trueValue = trueOption?.id || 'true';
  const falseValue = falseOption?.id || 'false';

  const [selectedValue, setSelectedValue] = useState<string | null>(() => {
    if (component.attempt?.response?.optionId) {
      return String(component.attempt.response.optionId);
    }
    if (component.attempt?.response?.value) {
      return component.attempt.response.value as 'true' | 'false';
    }
    if (component.attempt?.response?.selectedOption) {
      return String(component.attempt.response.selectedOption).toLowerCase() === 'true' ? 'true' : 'false';
    }
    return null;
  });

  const attemptResponseId = component.attempt?.response?.optionId || component.attempt?.response?.value || (String(component.attempt?.response?.selectedOption).toLowerCase() === 'true' ? 'true' : 'false');
  const locallySubmitted = isSubmitted || (component.attempt?.feedback?.submitted && attemptResponseId === selectedValue);
  
  const handleSelect = (val: string) => {
    if (disabled || isSubmitted) return;
    setSelectedValue(val);
    onAnswerChange?.(val);
  };

  if (!prompt || !trueOption || !falseOption) {
    return <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">This true-or-false activity has no valid learner content.</div>;
  }

  const getButtonStyle = (val: string) => {
    const isSelected = selectedValue === val;
    if (!isSelected) {
      return 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]';
    }

    if (locallySubmitted) {
      if (component.attempt?.isCorrect === true) {
        return 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
      } else if (component.attempt?.isCorrect === false) {
        return 'border-2 border-[#EF4444] bg-[#FEF2F2] text-[#B91C1C] shadow-sm';
      } else {
        return 'border-2 border-[#4F8DFB] bg-[#EFF6FF] text-[#1D4ED8] shadow-sm';
      }
    }

    // Selected in unsubmitted mode
    return 'border-2 border-[#4F8DFB] bg-[#EFF6FF] text-[#1D4ED8] shadow-sm';
  };

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-6 font-['Outfit',sans-serif] transition-all">
      {/* Prompt */}
      <h2 className="text-[17px] md:text-[18px] font-bold text-[#0F172A] leading-snug tracking-[-0.3px]">
        {prompt}
      </h2>

      {/* Dual Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSelect(trueValue)}
          disabled={disabled || isSubmitted}
          className={`w-full py-4 px-6 rounded-[12px] border text-center font-bold text-[15px] md:text-[16px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${getButtonStyle(
            trueValue
          )}`}
        >
          <span>True</span>
          {selectedValue === trueValue && locallySubmitted && component.attempt?.isCorrect === true && (
            <Check className="w-4 h-4 text-[#10B981]" />
          )}
          {selectedValue === trueValue && locallySubmitted && component.attempt?.isCorrect === false && (
            <X className="w-4 h-4 text-[#EF4444]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelect(falseValue)}
          disabled={disabled || isSubmitted}
          className={`w-full py-4 px-6 rounded-[12px] border text-center font-bold text-[15px] md:text-[16px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${getButtonStyle(
            falseValue
          )}`}
        >
          <span>False</span>
          {selectedValue === falseValue && locallySubmitted && component.attempt?.isCorrect === true && (
            <Check className="w-4 h-4 text-[#10B981]" />
          )}
          {selectedValue === falseValue && locallySubmitted && component.attempt?.isCorrect === false && (
            <X className="w-4 h-4 text-[#EF4444]" />
          )}
        </button>
      </div>

      {/* Optional Submit Button */}
      {onSubmit && !isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => selectedValue && onSubmit(selectedValue)}
            disabled={disabled || !selectedValue}
            className="bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] text-white px-6 py-2.5 rounded-[10px] font-bold text-[14px] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
