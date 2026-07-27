import React from 'react';
import { RotateCcw, Award } from 'lucide-react';

interface TopicCompletionModalProps {
  isOpen: boolean;
  onRetake: () => void;
}

export const TopicCompletionModal: React.FC<TopicCompletionModalProps> = ({
  isOpen,
  onRetake
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[420px] bg-white rounded-[24px] p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col items-center text-center font-['Outfit',sans-serif] gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Award Icon Badge */}
        <div className="w-14 h-14 bg-[#EFF6FF] border border-[#5C9DFF]/30 rounded-full flex items-center justify-center text-[#5C9DFF] shadow-sm">
          <Award className="w-7 h-7" />
        </div>

        {/* Text Group */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[22px] font-bold text-[#0F1450] tracking-[-0.3px] leading-tight">
            Topic Completed!
          </h3>
          <p className="text-[14px] leading-[20px] text-[#6E748F] px-2">
            You have already finished this topic. Would you like to retake this practice from the beginning?
          </p>
        </div>

        {/* Retake Action */}
        <div className="w-full pt-1">
          <button
            onClick={onRetake}
            className="w-full py-3 px-4 bg-[#5C9DFF] text-white rounded-full font-semibold text-[14px] hover:bg-[#4A8BEB] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Topic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicCompletionModal;
