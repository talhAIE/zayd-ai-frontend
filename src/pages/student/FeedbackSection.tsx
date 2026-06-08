import React from 'react';
import { BarChart } from 'lucide-react';

interface Assessment {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  prosodyScore: number;
}

interface Feedback {
  type: string;
  content: string | Assessment;
}

interface FeedbackSectionProps {
  isOpen: boolean;
  onClose?: () => void;
  feedback: Feedback | null;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ isOpen, onClose: _onClose, feedback = null }) => {
  const isAssessment = feedback && feedback.type === 'assessment';

  // Parse assessment content
  const parsedAssessment = React.useMemo(() => {
    if (!isAssessment) return null;
    try {
      return typeof feedback.content === 'string' ? JSON.parse(feedback.content) : feedback.content;
    } catch {
      return null;
    }
  }, [feedback, isAssessment]);

  const getDescriptor = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const renderAssessment = (assessments: Assessment | null) => {
    if (!assessments) return null;

    const metrics = [
      { key: 'accuracyScore', label: 'Accuracy', score: assessments.accuracyScore },
      { key: 'fluencyScore', label: 'Fluency', score: assessments.fluencyScore },
      { key: 'completenessScore', label: 'Completeness', score: assessments.completenessScore },
      { key: 'pronunciationScore', label: 'Pronunciation', score: assessments.pronunciationScore },
      { key: 'prosodyScore', label: 'Prosody', score: assessments.prosodyScore },
    ];

    const needsTips = metrics.filter(m => m.score < 80);

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Your Speech Assessment</h4>

        <div className="border rounded p-3 mb-2 bg-gray-50">
          {/* {metrics.map(({ key, label, score }) => (
            <div
              key={key}
              className="flex justify-between items-center transition-transform duration-300 hover:scale-105"
            >
              <span className="font-semibold text-gray-700">{label}:</span>
              <span className="font-bold bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
                {Math.round(score)}% ({getDescriptor(score)})
              </span>
            </div>
          ))} */}
          <div className="grid grid-cols-2 items-center gap-x-4 gap-y-1">
            {metrics.map(({ key, label, score }) => (
              <React.Fragment key={key}>
                {/* Column 1: The Label */}
                <span className="justify-self-start font-semibold text-gray-700">{label}:</span>

                {/* Column 2: The Score */}
                <span className="justify-self-end text-right font-bold bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
                  {Math.round(score)}% ({getDescriptor(score)})
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Tips for Improvement</h4>
          {needsTips.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {needsTips.map(({ key, label }) => {
                const tipsMap: Record<string, string> = {
                  accuracyScore: 'Review vocabulary and grammar for more precise answers.',
                  fluencyScore: 'Practice speaking without long pauses to sound more natural.',
                  completenessScore: 'Try to give full, detailed responses where possible.',
                  pronunciationScore: 'Focus on enunciating tricky sounds clearly.',
                  prosodyScore: 'Work on intonation and rhythm to improve expressiveness.',
                };
                return (
                  <li key={key} className="text-gray-600">
                    <strong>{label}:</strong> {tipsMap[key]}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-semibold text-green-600">
              Great job! You scored well across all areas. Keep practicing to maintain your performance.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    // <div className={`${isOpen ? 'block' : 'hidden'} bg-white rounded-lg shadow-lg p-4 h-full`}>
    <div id="tour-feedback-panel" className={`${isOpen ? 'block' : 'hidden'} bg-white rounded-lg shadow-lg p-4 max-h-[320px] overflow-y-auto border`}>
      <div>
        {/* <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div> */}

        <div>
          <div className="bg-white rounded-lg">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {isAssessment ? (
                    <BarChart
                      size={24}
                      className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text"
                    />
                  ) : (
                    <span>💬</span>
                  )}
                  <h3 className="ml-2 font-bold text-lg">
                    {isAssessment ? 'Speech Assessment' : 'Chat Feedback'}
                  </h3>
                </div>
              </div>
            </div>
            <div>
              {feedback ? (
                isAssessment
                  ? renderAssessment(parsedAssessment as Assessment)
                  : <p className="bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent">
                    {feedback.content as string}
                  </p>
              ) : (
                <p className="text-gray-500">
                  Click the "View Feedback" or "View Assessment" button on any message to see details here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;