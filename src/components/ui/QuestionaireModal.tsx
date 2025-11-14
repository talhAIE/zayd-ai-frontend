import React, { useState, useMemo, useEffect } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  hint: string;
}

interface QuestionnaireModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (answers: { [questionId: string]: number }) => void;
  mcqs: Question[];
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  open,
  onClose,
  onSubmit,
  mcqs,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number;
  }>({});
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [showValidation, setShowValidation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(0);
      setShowValidation(false);
      setSelectedOptions({});
      setShowHints({});
    }
  }, [open]);

  const validationStatus = useMemo(() => {
    const totalQuestions = mcqs.length;
    const answeredQuestions = Object.keys(selectedOptions).length;
    const allAnswered = answeredQuestions === totalQuestions;
    let correctAnswers = 0;

    mcqs.forEach((q) => {
      if (selectedOptions[q.id] === q.correct) {
        correctAnswers++;
      }
    });

    return {
      allAnswered,
      correctAnswers,
      totalQuestions,
      answeredQuestions,
      canSubmit: allAnswered,
    };
  }, [selectedOptions, mcqs]);

  const handleOptionChange = (questionId: string, optionIndex: number) => {
    const question = mcqs.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correct === optionIndex;

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    setShowHints((prev) => ({
      ...prev,
      [questionId]: !isCorrect,
    }));
  };

  const handleDone = () => {
    setShowValidation(true);
    if (validationStatus.canSubmit) {
      onSubmit(selectedOptions);
    }
  };

  const isQuestionCorrect = (questionId: string) => {
    const question = mcqs.find((q) => q.id === questionId);
    return question && selectedOptions[questionId] === question.correct;
  };

  const isQuestionAnswered = (questionId: string) => {
    return selectedOptions.hasOwnProperty(questionId);
  };

  if (!open) return null;

  const question = mcqs[currentQuestionIndex];
  const isAnswered = isQuestionAnswered(question.id);
  const isCorrect = isQuestionCorrect(question.id);
  const shouldShowHint = showHints[question.id];
  const isLastQuestion = currentQuestionIndex === mcqs.length - 1;
  const canGoNext = isAnswered && isCorrect;
  const canSubmitNow = validationStatus.canSubmit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-50">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 p-2 w-10 h-10 hover:bg-gray-100 rounded-full transition-colors" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 tracking-wider pb-2">
          Task Completed!
        </h2>
        <p className="text-sm mb-4">
          Your task has been successfully completed. Please answer the questions
          below to proceed.
        </p>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg mb-4">
          <div className="text-sm text-gray-600">
            Progress: {validationStatus.answeredQuestions}/
            {validationStatus.totalQuestions} answered
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (validationStatus.answeredQuestions /
                    validationStatus.totalQuestions) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-700">
                {currentQuestionIndex + 1}. {question.question}
              </h3>
              {showValidation && isAnswered && (
                <div className="flex items-center">
                  {isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedOptions[question.id] === optionIndex;
              const isCorrectOption = optionIndex === question.correct;

              let borderColor =
                "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
              let textColor = "text-gray-700";

              if (isSelected) {
                if (isCorrectOption) {
                  borderColor = "border-green-600 bg-green-50";
                  textColor = "text-green-600 font-medium";
                } else {
                  borderColor = "border-red-600 bg-red-50";
                  textColor = "text-red-600 font-medium";
                }
              }

              return (
                <label
                  key={optionIndex}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${borderColor}`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionChange(question.id, optionIndex)
                    }
                  />
                  <span className={`text-sm ${textColor}`}>{option}</span>
                </label>
              );
            })}
          </div>

          {question.hint && shouldShowHint && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-xs text-yellow-700 font-medium">
                💡 Hint: {question.hint}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {currentQuestionIndex > 0 ? (
            <button
              className="text-sm text-gray-600 hover:underline"
              onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          {isLastQuestion ? (
            <button
              className={`px-6 py-2 rounded-full transition-colors ${
                canSubmitNow
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleDone}
              disabled={!canSubmitNow}
            >
              {!validationStatus.allAnswered
                ? `Answer All Questions (${validationStatus.answeredQuestions}/${validationStatus.totalQuestions})`
                : "Submit"}
            </button>
          ) : (
            <button
              className={`px-6 py-2 rounded-full transition ${
                canGoNext
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              disabled={!canGoNext}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
