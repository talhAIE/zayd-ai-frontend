import { Star, CheckCircle, HelpCircle } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface TextVariationComponentProps {
  component: LearningComponent;
}

export default function TextVariationComponent({ component }: TextVariationComponentProps) {
  const content = component.content || {};
  const heading = content.heading || content.title || component.title;
  const body = content.body || content.introduction;
  const learningGoal = content.learningGoal;
  const essentialQuestion = content.essentialQuestion;
  const goals = content.goals || [];
  const standards = content.standards || [];

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-5 font-['Outfit',sans-serif]">
      {/* Learning Goal or Main Heading */}
      {learningGoal && (
        <div className="rounded-[16px] bg-gradient-to-r from-[#0267B5] to-[#249CFF] p-5 md:p-6 text-white flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-bold tracking-wider uppercase">
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            <span>LEARNING OBJECTIVE</span>
          </div>
          <p className="font-bold text-[16px] md:text-[18px] leading-snug">
            {learningGoal}
          </p>
        </div>
      )}

      {/* Heading & Body */}
      {heading && !learningGoal && (
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#0F172A] tracking-[-0.3px]">
          {heading}
        </h2>
      )}

      {body && (
        <p className="text-[14px] md:text-[15px] text-[#475569] leading-relaxed">
          {body}
        </p>
      )}

      {/* Essential Question */}
      {essentialQuestion && (
        <div className="p-4 rounded-[12px] bg-[#F8FAFC] border-l-4 border-[#3B82F6] flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider">
              Essential Question
            </span>
            <p className="text-[14px] font-semibold text-[#0F172A]">
              {essentialQuestion}
            </p>
          </div>
        </div>
      )}

      {/* Goals / Bullet Points */}
      {goals.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-1">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
            Key Goals
          </span>
          <div className="grid grid-cols-1 gap-2">
            {goals.map((goal: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#F8FAFC] border border-[#EEF2F6]">
                <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span className="text-[13px] md:text-[14px] text-[#334155] font-medium">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standards */}
      {standards.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-bold uppercase text-[#94A3B8] self-center">
            Standards:
          </span>
          {standards.map((std: string, idx: number) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-md bg-gray-100 text-[#475569] text-[11px] font-semibold">
              {std}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
