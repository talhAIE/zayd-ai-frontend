import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface TrueFalseComponentProps {
  component: LearningComponent;
  onAnswerChange?: (value: 'true' | 'false') => void;
  onSubmit?: (value: 'true' | 'false') => void;
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
    'True or False: The nucleus is the center of an atom.';

  // Check correct option from component.options or answerKey
  const trueOption = component.options?.find((o) => o.value === 'true' || o.label.toLowerCase() === 'true');
  const isTrueCorrect = trueOption?.isCorrect ?? true;

  const [selectedValue, setSelectedValue] = useState<'true' | 'false' | null>(() => {
    if (component.attempt?.response?.value) {
      return component.attempt.response.value as 'true' | 'false';
    }
    if (component.attempt?.response?.selectedOption) {
      return String(component.attempt.response.selectedOption).toLowerCase() === 'true' ? 'true' : 'false';
    }
    return null;
  });

  const handleSelect = (val: 'true' | 'false') => {
    if (disabled || isSubmitted) return;
    setSelectedValue(val);
    onAnswerChange?.(val);
  };

  const getButtonStyle = (val: 'true' | 'false') => {
    const isSelected = selectedValue === val;
    const isThisOptionCorrect = val === 'true' ? isTrueCorrect : !isTrueCorrect;

    if (!isSelected) {
      return 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]';
    }

    if (isSubmitted) {
      if (isThisOptionCorrect) {
        return 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
      } else {
        return 'border-2 border-[#EF4444] bg-[#FEF2F2] text-[#B91C1C] shadow-sm';
      }
    }

    // Selected in unsubmitted mode
    return 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
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
          onClick={() => handleSelect('true')}
          disabled={disabled || isSubmitted}
          className={`w-full py-4 px-6 rounded-[12px] border text-center font-bold text-[15px] md:text-[16px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${getButtonStyle(
            'true'
          )}`}
        >
          <span>True</span>
          {selectedValue === 'true' && isSubmitted && isTrueCorrect && (
            <Check className="w-4 h-4 text-[#10B981]" />
          )}
          {selectedValue === 'true' && isSubmitted && !isTrueCorrect && (
            <X className="w-4 h-4 text-[#EF4444]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelect('false')}
          disabled={disabled || isSubmitted}
          className={`w-full py-4 px-6 rounded-[12px] border text-center font-bold text-[15px] md:text-[16px] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${getButtonStyle(
            'false'
          )}`}
        >
          <span>False</span>
          {selectedValue === 'false' && isSubmitted && !isTrueCorrect && (
            <Check className="w-4 h-4 text-[#10B981]" />
          )}
          {selectedValue === 'false' && isSubmitted && isTrueCorrect && (
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
