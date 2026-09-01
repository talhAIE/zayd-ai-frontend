import { BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface SpeechAssessment {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  prosodyScore: number;
}

export function isSpeechAssessment(value: unknown): value is SpeechAssessment {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  const assessment = value as Record<string, unknown>;
  return [
    'accuracyScore',
    'fluencyScore',
    'completenessScore',
    'pronunciationScore',
    'prosodyScore',
  ].every((key) => typeof assessment[key] === 'number');
}

const descriptorFor = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  return 'Needs Improvement';
};

const adviceFor: Record<keyof SpeechAssessment, string> = {
  accuracyScore: 'Focus on saying the expected words clearly and completely.',
  fluencyScore: 'Try to speak smoothly with fewer pauses between words.',
  completenessScore: 'Read the full sentence before sending your recording.',
  pronunciationScore: 'Focus on enunciating tricky sounds clearly.',
  prosodyScore: 'Work on intonation and rhythm to sound more natural.',
};

export default function SpeechAssessmentModal({
  assessment,
  open,
  onClose,
}: {
  assessment: SpeechAssessment | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!assessment) return null;

  const metrics: Array<{ key: keyof SpeechAssessment; label: string }> = [
    { key: 'accuracyScore', label: 'Accuracy' },
    { key: 'fluencyScore', label: 'Fluency' },
    { key: 'completenessScore', label: 'Completeness' },
    { key: 'pronunciationScore', label: 'Pronunciation' },
    { key: 'prosodyScore', label: 'Prosody' },
  ];
  const improvementMetrics = metrics.filter(
    (metric) => assessment[metric.key] < 80,
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[420px] rounded-xl p-6 font-['Outfit',sans-serif]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[18px] font-bold text-[#0F1450]">
            <BarChart3 className="h-5 w-5 text-[#5C9DFF]" />
            Speech Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <section>
            <h3 className="text-[13px] font-semibold text-[#475569]">Your Speech Assessment</h3>
            <div className="mt-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              {metrics.map((metric) => {
                const score = assessment[metric.key];
                return (
                  <div key={metric.key} className="flex items-center justify-between gap-4 py-0.5 text-[13px]">
                    <span className="font-semibold text-[#475569]">{metric.label}:</span>
                    <span className="font-bold text-[#6D5DFB]">
                      {Math.round(score)}% ({descriptorFor(score)})
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-[#475569]">Tips for Improvement</h3>
            {improvementMetrics.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-5 text-[#475569]">
                {improvementMetrics.map((metric) => (
                  <li key={metric.key}>
                    <strong>{metric.label}:</strong> {adviceFor[metric.key]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-[#15803D]">Excellent work—your speech scores are strong across every area.</p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
