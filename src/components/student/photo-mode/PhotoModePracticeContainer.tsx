import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Play, Pause, ArrowRight, Mic, Square, Info, Headphones, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTopicItem } from "@/pages/student/topics/PhotoModeTopics";
import { PhotoModeCompletion } from "./PhotoModeCompletion";

interface PhotoModePracticeContainerProps {
  topic: DemoTopicItem;
  onBack?: () => void;
}

export type FeedbackState = "NONE" | "SUCCESS" | "ERROR";

export const PhotoModePracticeContainer: React.FC<PhotoModePracticeContainerProps> = ({
  topic,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGuidePlaying, setIsGuidePlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);

  // Step 4 recording states & Feedback states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(3);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("NONE");

  const steps = [1, 2, 3, 4];

  // Timer simulation for Step 4 recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 4 && isRecording && feedbackState === "NONE" && !isTopicCompleted) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, isRecording, feedbackState, isTopicCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleReRecord = () => {
    setRecordingTime(0);
    setIsRecording(true);
    setFeedbackState("NONE");
  };

  const handleSubmitRecordingSuccess = () => {
    setIsRecording(false);
    setFeedbackState("SUCCESS");
  };

  const handleSubmitRecordingError = () => {
    setIsRecording(false);
    setFeedbackState("ERROR");
  };

  const handleTryAgain = () => {
    setFeedbackState("NONE");
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleNextSentence = () => {
    setFeedbackState("NONE");
    setIsTopicCompleted(true);
  };

  // Render Topic Complete Screen if finished
  if (isTopicCompleted) {
    return (
      <PhotoModeCompletion
        topic={topic}
        onBackToTopics={() => {
          setIsTopicCompleted(false);
          setCurrentStep(1);
          if (onBack) onBack();
        }}
        onNextTopic={() => {
          setIsTopicCompleted(false);
          setCurrentStep(1);
          if (onBack) onBack();
        }}
      />
    );
  }

  // Dynamic step header configuration matching steps 1, 2, 3, 4 & feedback states
  const getStepContent = () => {
    if (feedbackState === "SUCCESS") {
      return {
        title: "Speech Feedback",
        subtitle: "Review the evaluation results for your spoken sentence.",
        buttonText: "Next Sentence",
        buttonClass: "bg-[#5C9DFF] hover:bg-blue-600",
      };
    }
    if (feedbackState === "ERROR") {
      return {
        title: "Speech Feedback",
        subtitle: "Review the pronunciation feedback and listen again to improve.",
        buttonText: "Try Again",
        buttonClass: "bg-[#5C9DFF] hover:bg-blue-600",
      };
    }
    if (currentStep === 4) {
      return {
        title: "Speak & Record",
        subtitle: "Read the Arabic sentence aloud clearly. Try to match the guide's rhythm.",
        buttonText: "Submit & Continue",
        buttonClass: "bg-[#5C9DFF] hover:bg-blue-600",
      };
    }
    if (currentStep === 3) {
      return {
        title: "Prepare to Record",
        subtitle: "Review the prompt and listen carefully before you start speaking.",
        buttonText: "Ready to Record",
        buttonClass: "bg-[#06CCB5] hover:bg-[#05b8a3]",
      };
    }
    if (currentStep === 2) {
      return {
        title: "Sentence Builder",
        subtitle: "Listen to the English translation and examine the structure.",
        buttonText: "Next Step",
        buttonClass: "bg-[#06CCB5] hover:bg-[#05b8a3]",
      };
    }
    // Default Step 1
    return {
      title: "Sentence Builder",
      subtitle: "Listen to the narration and review the sentence structures.",
      buttonText: "Next Step",
      buttonClass: "bg-[#06CCB5] hover:bg-[#05b8a3]",
    };
  };

  const stepHeader = getStepContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6 font-outfit">
      {/* Main Inner Card Container */}
      <div className="w-full bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-sm flex flex-col gap-6">
        {/* Step Indicator Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
          <div className="flex flex-col gap-1">
            <h3 className="font-outfit font-bold text-[18px] leading-[23px] text-[#0F1450]">
              {stepHeader.title}
            </h3>
            <p className="font-outfit font-normal text-[13px] leading-[16px] text-[#6E748F]">
              {stepHeader.subtitle}
            </p>
          </div>

          {/* 4 Steps Numbers Track */}
          <div className="flex items-center justify-center w-full sm:w-auto gap-1.5">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => {
                  setCurrentStep(step);
                  setFeedbackState("NONE");
                  if (step === 4) setIsRecording(true);
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-outfit font-bold text-[13px] transition-all duration-200 ${
                  currentStep === step && feedbackState === "NONE"
                    ? "bg-[#06CCB5] text-white shadow-sm"
                    : "bg-[#F0F4FA] text-[#6E748F] hover:bg-gray-200"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Active Workspace */}
        {feedbackState === "SUCCESS" ? (
          /* Feedback Success Workspace (matching photo-mode-feedback-success.css & .jpg) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            {/* Left Column: Photo Workspace */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <div className="w-full aspect-[2528/1696] rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={topic.attachmentUrl}
                  alt={topic.topicName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-[#6E748F]">
                <ImageIcon className="w-4 h-4 text-[#6E748F]" />
                <span className="font-outfit font-normal text-[12px] leading-[15px]">
                  Photo 1 of 10: Vendor counter details
                </span>
              </div>
            </div>

            {/* Right Column: Analysis Column Success (analysis-col) */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#E8F5E9] rounded-[16px] p-6 border border-emerald-200 min-h-[321px]">
              {/* Message Header */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#16A34A] text-white shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h2 className="font-outfit font-bold text-[22px] leading-[28px] text-[#0F1450]">
                  Excellent pronunciation!
                </h2>
              </div>

              {/* Arabic Success Display */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <h3 className="font-outfit font-bold text-[26px] leading-[33px] text-[#16A34A] dir-rtl">
                  أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ.
                </h3>
                <p className="font-outfit font-normal text-[14px] leading-[18px] text-[#6E748F]">
                  "I want to buy some fresh tomatoes."
                </p>
              </div>

              {/* Match Comparison Box (match-comparison-box) */}
              <div className="flex items-center gap-4 bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16A34A] text-white shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#0F1450]">
                    Pronunciation Match
                  </span>
                  <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">
                    Native level pitch and pacing.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : feedbackState === "ERROR" ? (
          /* Feedback Error Workspace (matching photo-mode-feedback-error.css & .jpg) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            {/* Left Column: Photo Workspace */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <div className="w-full aspect-[2528/1696] rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={topic.attachmentUrl}
                  alt={topic.topicName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-[#6E748F]">
                <ImageIcon className="w-4 h-4 text-[#6E748F]" />
                <span className="font-outfit font-normal text-[12px] leading-[15px]">
                  Photo 1 of 10: Vendor counter details
                </span>
              </div>
            </div>

            {/* Right Column: Analysis Column Error (analysis-col) */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#F59E0B]/10 rounded-[16px] p-6 border border-[#F59E0B]/20 min-h-[296px]">
              {/* Message Header */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F59E0B] text-white shadow-md">
                  <Info className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h2 className="font-outfit font-bold text-[22px] leading-[28px] text-[#0F1450]">
                  Not a Match
                </h2>
              </div>

              {/* Arabic Error Display */}
              <div className="flex flex-col items-center text-center gap-2">
                <h3 className="font-outfit font-bold text-[26px] leading-[33px] text-[#0F1450] dir-rtl">
                  أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ.
                </h3>
                <div className="inline-flex items-center px-2.5 py-1 bg-white border border-[#F59E0B] rounded-[6px] shadow-2xs">
                  <span className="font-outfit font-semibold text-[11px] leading-[14px] text-[#F59E0B]">
                    الطَّماطِمِ
                  </span>
                </div>
              </div>

              {/* Audio Assistance Row */}
              <div className="flex items-center gap-3 bg-white rounded-[12px] p-3 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setIsGuidePlaying(!isGuidePlaying)}
                  aria-label="Listen again"
                  className="flex items-center justify-center w-9 h-8 rounded-[8px] bg-[#5C9DFF] text-white hover:brightness-105 transition-all shrink-0"
                >
                  <Headphones className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-col text-left">
                  <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#0F1450]">
                    Listen Again
                  </span>
                  <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">
                    Hear the correct pronunciation guide.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 4 ? (
          /* Step 4 Record Audio Workspace (matching photo-mode-step4-record-audio.css) */
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Phrase Reference Banner */}
            <div className="w-full flex flex-col items-center justify-center gap-2 bg-[#F0F4FA] rounded-[16px] p-5 border border-[#E0E7F5]">
              <span className="font-outfit font-bold text-[12px] leading-[15px] tracking-wider text-[#6E748F] uppercase">
                REFERENCE SENTENCE
              </span>
              <h2 className="font-outfit font-bold text-[28px] leading-[35px] text-[#0F1450] dir-rtl text-center">
                أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ.
              </h2>
            </div>

            {/* Recording Console */}
            <div className="w-full flex flex-col items-center justify-center gap-6 bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm">
              {/* Mic Pulse Button */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`flex items-center justify-center w-[112px] h-[112px] rounded-full transition-all duration-500 ${
                    isRecording ? "bg-blue-100 animate-ping" : "bg-[#5C9DFF]/10"
                  }`}
                />
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`absolute flex items-center justify-center w-[88px] h-[88px] rounded-full shadow-[0px_8px_16px_rgba(6,204,181,0.25)] transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#5C9DFF] hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 fill-white text-white" />
                  ) : (
                    <Mic className="w-9 h-9 text-white stroke-[2]" />
                  )}
                </button>
              </div>

              {/* Recording State Stack */}
              <div className="flex flex-col items-center text-center gap-1">
                <span className="font-outfit font-bold text-[32px] leading-[40px] text-[#282828]">
                  {formatTime(recordingTime)}
                </span>
                <p className="font-outfit font-semibold text-[15px] leading-[19px] text-[#6E748F]">
                  {isRecording
                    ? "Recording... Read the sentence aloud clearly"
                    : "Tap mic to start recording"}
                </p>
              </div>

              {/* Recorded Audio Waveform Box (recording-waveform-container) */}
              <div className="w-full max-w-[500px] h-[64px] bg-[#5C9DFF]/15 border border-[#5C9DFF]/20 rounded-[12px] px-4 py-3 flex items-center justify-center gap-1">
                {[12, 20, 8, 16, 28, 32, 24, 14, 18, 30, 10, 16, 24, 20, 12, 18, 26, 14, 22, 16, 20, 12].map(
                  (h, i) => (
                    <span
                      key={i}
                      className={`w-[4px] rounded-[2px] ${
                        isRecording ? "bg-[#5C9DFF] animate-pulse" : "bg-[#5C9DFF]"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  )
                )}
              </div>

              {/* Console Action Buttons (console-actions) */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleReRecord}
                  className="h-[43px] px-6 border-[1.5px] border-[#0F1450] bg-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] text-[#0F1450] hover:bg-gray-50 transition-colors"
                >
                  Re-record
                </button>
                <button
                  onClick={handleSubmitRecordingSuccess}
                  className="h-[43px] px-6 bg-[#06CCB5] hover:bg-[#05b8a3] text-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] shadow-[0px_4px_8px_rgba(6,204,181,0.18)] transition-all"
                >
                  Submit (Success)
                </button>
                <button
                  onClick={handleSubmitRecordingError}
                  className="h-[43px] px-6 bg-[#F59E0B] hover:bg-[#d98207] text-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] shadow-sm transition-all"
                >
                  Submit (Error)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Steps 1, 2, 3 Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Photo Workspace */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <div className="w-full aspect-[2528/1696] rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={topic.attachmentUrl}
                  alt={topic.topicName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-[#6E748F]">
                <ImageIcon className="w-4 h-4 text-[#6E748F]" />
                <span className="font-outfit font-normal text-[12px] leading-[15px]">
                  Photo 1 of 10: Vendor counter details
                </span>
              </div>
            </div>

            {/* Right Column Panel */}
            {currentStep === 3 ? (
              /* Step 3 Prompt Panel */
              <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#F0F4FA] rounded-[16px] p-6 border border-[#E0E7F5] min-h-[300px]">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#06CCB5]/10 border border-[#06CCB5] rounded-[20px]">
                    <span className="font-outfit font-bold text-[14px] leading-[18px] text-[#06CCB5]">
                      دورك للقراءة
                    </span>
                  </div>
                  <span className="font-outfit font-medium text-[18px] leading-[23px] text-[#6E748F]">
                    (It's your turn to read)
                  </span>
                </div>

                <div className="flex flex-col items-center text-center gap-2 bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-sm">
                  <h2 className="font-outfit font-bold text-[32px] leading-[40px] text-[#0F1450] dir-rtl">
                    أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ.
                  </h2>
                  <p className="font-outfit font-normal text-[16px] leading-[20px] text-[#6E748F]">
                    "I want to buy some fresh tomatoes."
                  </p>
                </div>

                <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsGuidePlaying(!isGuidePlaying)}
                      aria-label={isGuidePlaying ? "Pause guide audio" : "Play guide audio"}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-[#06CCB5] text-white hover:brightness-105 transition-all shrink-0"
                    >
                      {isGuidePlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex flex-col text-left">
                      <span className="font-outfit font-semibold text-[14px] leading-[18px] text-[#0F1450]">
                        Listen to guide audio
                      </span>
                      <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">
                        Native speaker pronunciation guide (0:04)
                      </span>
                    </div>
                  </div>
                  <Mic className="w-6 h-6 text-[#06CCB5]" />
                </div>
              </div>
            ) : (
              /* Step 1 & Step 2 Narration / English Panel */
              <div className="lg:col-span-6 flex flex-col justify-center gap-5 bg-[#F0F4FA] rounded-[16px] p-6 border border-[#E0E7F5]">
                <div className="flex flex-col items-center text-center gap-2">
                  {currentStep === 2 && (
                    <span className="font-outfit font-semibold text-[14px] leading-[18px] tracking-wider text-[#6E748F] uppercase">
                      LISTEN TO THE ENGLISH TRANSLATION
                    </span>
                  )}
                  <h2
                    className={`font-outfit font-bold ${
                      currentStep === 1
                        ? "text-[28px] leading-[35px] text-[#0F1450] dir-rtl"
                        : "text-[26px] leading-[33px] text-[#0F1450]"
                    }`}
                  >
                    {currentStep === 1
                      ? "أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ."
                      : '"I want to buy some fresh tomatoes."'}
                  </h2>
                  <p
                    className={`font-outfit font-normal text-[15px] leading-[19px] text-[#6E748F] ${
                      currentStep === 2 ? "dir-rtl" : ""
                    }`}
                  >
                    {currentStep === 1
                      ? '"I want to buy some fresh tomatoes."'
                      : "أُريدُ شِراءَ بَعْضِ الطَّماطِمِ الطَّازَجَةِ."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 bg-white border border-[#E5E7EB] rounded-[12px] p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#06CCB5] text-white hover:brightness-105 transition-all shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 flex items-center gap-[3px] h-8">
                      {[16, 24, 12, 18, 30, 26, 14, 20, 10, 22, 28, 16, 12, 18, 8, 24, 14, 18, 26].map(
                        (height, i) => (
                          <span
                            key={i}
                            className={`w-[3px] rounded-[1.5px] transition-all duration-300 ${
                              i < 10 && isPlaying
                                ? "bg-[#06CCB5] animate-pulse"
                                : i < 10
                                ? "bg-[#06CCB5]"
                                : "bg-[#6E748F]/40"
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#06CCB5] font-outfit">
                    <span>0:04</span>
                    <span className="text-[#6E748F]">0:12</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB]/50">
          {/* Left Controls: Helper Chips, Skip Button, or View Breakdown */}
          {feedbackState === "SUCCESS" ? (
            <span className="bg-[#F5F5F6] text-[#6E748F] rounded-[20px] px-3.5 py-1.5 text-[13px] font-semibold font-outfit cursor-pointer hover:bg-gray-200 transition-colors">
              View Breakdown
            </span>
          ) : feedbackState === "ERROR" ? (
            <button
              onClick={() => {
                setFeedbackState("NONE");
                setCurrentStep(1);
              }}
              className="h-[42px] px-5 bg-white border border-[#6E748F] rounded-[12px] font-outfit font-semibold text-[14px] leading-[18px] text-[#6E748F] hover:bg-gray-50 transition-colors"
            >
              Skip Sentence
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-[#F3F4F6] text-[#6E748F] rounded-[20px] px-3 py-1.5 text-[12px] font-bold font-outfit cursor-pointer hover:bg-gray-200 transition-colors">
                Vocabulary List
              </span>
              <span className="bg-[#F3F4F6] text-[#6E748F] rounded-[20px] px-3 py-1.5 text-[12px] font-bold font-outfit cursor-pointer hover:bg-gray-200 transition-colors">
                Grammar Notes
              </span>
            </div>
          )}

          {/* Right Action Button */}
          {feedbackState === "SUCCESS" ? (
            <Button
              onClick={handleNextSentence}
              className="h-[43px] px-6 bg-[#5C9DFF] hover:bg-blue-600 text-white rounded-[12px] font-outfit font-bold text-[15px] flex items-center gap-2 shadow-none transition-all"
            >
              <span>Next Sentence</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </Button>
          ) : feedbackState === "ERROR" ? (
            <Button
              onClick={handleTryAgain}
              className="h-[43px] px-6 bg-[#5C9DFF] hover:bg-blue-600 text-white rounded-[12px] font-outfit font-bold text-[15px] flex items-center gap-2 shadow-none transition-all"
            >
              <span>Try Again</span>
              <RotateCcw className="w-4 h-4 text-white stroke-[2.5]" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (currentStep === 4) {
                  handleSubmitRecordingSuccess();
                } else {
                  setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
                }
              }}
              className={`h-[43px] px-6 text-white rounded-[12px] font-outfit font-bold text-[15px] flex items-center gap-2 shadow-none transition-all ${stepHeader.buttonClass}`}
            >
              <span>{stepHeader.buttonText}</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModePracticeContainer;
