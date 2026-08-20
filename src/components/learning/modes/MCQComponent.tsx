import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface MCQComponentProps {
  component: LearningComponent;
  onAnswerChange?: (selectedOptionValue: string) => void;
  onSubmit?: (selectedOptionValue: string) => void;
  isSubmitted?: boolean;
  disabled?: boolean;
}

export default function MCQComponent({
  component,
  onAnswerChange,
  onSubmit,
  isSubmitted = false,
  disabled = false,
}: MCQComponentProps) {
  const prompt = component.content?.prompt || component.title || 'Choose the correct answer:';
  
  const rawOptions = component.options || component.content?.options || [
    { label: 'We add the fractions', value: 'a' },
    { label: 'We multiply by the reciprocal', value: 'b', isCorrect: true },
    { label: 'The fraction becomes a whole number', value: 'c' },
  ];

  const options = rawOptions.map((opt: any, index: number) => {
    const label = typeof opt === 'string' ? opt : opt.label || opt.text || '';
    const value = typeof opt === 'string' ? opt : opt.value !== undefined ? String(opt.value) : label;
    const isCorrect = typeof opt === 'object' ? opt.isCorrect : undefined;
    const prefix = String.fromCharCode(65 + index); // A, B, C, D...
    
    // Remove existing "A. " or "A) " prefix if already in label
    const cleanedLabel = label.replace(/^[A-Za-z][.)]\s*/, '');

    return {
      prefix,
      label: cleanedLabel,
      value,
      isCorrect,
    };
  });

  const [selectedValue, setSelectedValue] = useState<string>(() => {
    if (component.myAttempt?.response?.selectedOption) {
      return String(component.myAttempt.response.selectedOption);
    }
    if (component.myAttempt?.response?.value) {
      return String(component.myAttempt.response.value);
    }
    return '';
  });

  const handleSelect = (val: string) => {
    if (disabled || isSubmitted) return;
    setSelectedValue(val);
    onAnswerChange?.(val);
  };

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-6 font-['Outfit',sans-serif] transition-all">
      {/* Question Prompt */}
      <h2 className="text-[18px] md:text-[20px] font-bold text-[#0F172A] leading-snug tracking-[-0.3px]">
        {prompt}
      </h2>

      {/* Options List */}
      <div className="flex flex-col gap-3.5">
        {options.map((opt: { prefix: string; label: string; value: string; isCorrect?: boolean }) => {
          const isSelected = selectedValue === opt.value;
          
          let containerStyle = 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#94A3B8] hover:bg-[#F8FAFC]';
          let textStyle = 'text-[#64748B] font-medium';

          if (isSelected) {
            if (isSubmitted) {
              if (opt.isCorrect === true || component.myAttempt?.isCorrect === true) {
                containerStyle = 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
                textStyle = 'text-[#065F46] font-bold';
              } else if (opt.isCorrect === false || component.myAttempt?.isCorrect === false) {
                containerStyle = 'border-2 border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] shadow-sm';
                textStyle = 'text-[#991B1B] font-bold';
              } else {
                containerStyle = 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
                textStyle = 'text-[#065F46] font-bold';
              }
            } else {
              containerStyle = 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] shadow-sm';
              textStyle = 'text-[#065F46] font-bold';
            }
          }

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              disabled={disabled || isSubmitted}
              className={`w-full text-left rounded-[14px] border p-4 md:p-5 flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${containerStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[15px] md:text-[16px] ${textStyle}`}>
                  <span className="font-bold mr-1.5">{opt.prefix}.</span> {opt.label}
                </span>
              </div>

              {isSelected && isSubmitted && opt.isCorrect === true && (
                <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {isSelected && isSubmitted && opt.isCorrect === false && (
                <div className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Optional Submit Button if needed */}
      {onSubmit && !isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onSubmit(selectedValue)}
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
