import React from "react";
import { ArrowRight, BookOpen, Check, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "../AudioPlayer3D";
import AvatarModeLayout from "@/components/3d/AvatarModeLayout";
import birdWithHeadphones from "@/assets/images/bird-with-headphones.png";
import { formatTime } from "./chat3d.shared";

interface ListeningQuizProps {
  mcqList: any[];
  currentMcqIndex: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

interface ListeningPanelProps {
  isListeningStepTransitioning: boolean;
  sessionTimeRemaining: number | null;
  isAvatar3D: boolean;
  listeningAvatarSeed: number;
  playingAudioId: string | null;
  isCurrentlyPlaying: boolean;
  avatarVideoSrc?: string;
  listeningData: any;
  audioProgress: number;
  audioDuration: number;
  toggleAudio: (
    id: string,
    audioUrl: string | undefined,
    onEnd?: () => void,
  ) => void;
  handleKbAudioEnd: () => void;
  shouldShowListeningIntro: boolean;
  shouldShowListeningHint: boolean;
  listeningHintText: string[];
  listeningStage: string | null;
  showListeningCompletionCard: boolean;
  transcriptRef: React.RefObject<HTMLParagraphElement>;
  isTranscriptExpanded: boolean;
  setIsTranscriptExpanded: (expanded: boolean) => void;
  shouldShowTranscriptExpandButton: boolean;
  onContinueToQuiz: () => void;
  onReplayAvatarVideo: () => void;
}

interface ListeningNextButtonProps {
  listeningStage: string | null;
  disabled: boolean;
  onClick: () => void;
}

export function ListeningQuiz({
  mcqList,
  currentMcqIndex,
  selectedAnswer,
  onSelectAnswer,
}: ListeningQuizProps) {
  if (mcqList.length === 0) {
    return null;
  }

  const currentQuestion = mcqList[currentMcqIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="p-6 md:p-8 border rounded-3xl bg-white shadow-lg w-full max-w-[820px] mt-4 mb-2 text-left">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E6F3FF] flex items-center justify-center">
              <Check className="h-5 w-5 text-[#3EA4F9]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B8BB8] uppercase tracking-wide">
                Step 4: Quiz
              </p>
              <p className="text-lg font-semibold text-[#2B3A67]">
                Test Your Knowledge
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#6B8BB8] bg-[#F1F6FF] px-3 py-1 rounded-full">
            {currentMcqIndex + 1}/{mcqList.length}
          </span>
        </div>
        <p className="text-lg font-semibold mb-4 text-[#2B3A67]">
          {currentQuestion.question}
        </p>
        <div className="flex flex-col gap-2">
          {currentQuestion.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              onClick={() => onSelectAnswer(index)}
              className={`w-full justify-start p-4 h-auto transition-colors rounded-2xl ${
                selectedAnswer === index
                  ? "bg-[#3EA4F9] text-white hover:bg-[#2F93F0] border-transparent"
                  : "bg-white border-[#E1E7F0] text-[#2B3A67]"
              }`}
            >
              <div
                className={`w-5 h-5 mr-4 rounded-full border flex-shrink-0 ${
                  selectedAnswer === index
                    ? "bg-white border-white"
                    : "border-[#C9D6E6]"
                }`}
              />
              <span>{option}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListeningPanel({
  isListeningStepTransitioning,
  sessionTimeRemaining,
  isAvatar3D,
  listeningAvatarSeed,
  playingAudioId,
  isCurrentlyPlaying,
  avatarVideoSrc,
  listeningData,
  audioProgress,
  audioDuration,
  toggleAudio,
  handleKbAudioEnd,
  shouldShowListeningIntro,
  shouldShowListeningHint,
  listeningHintText,
  listeningStage,
  showListeningCompletionCard,
  transcriptRef,
  isTranscriptExpanded,
  setIsTranscriptExpanded,
  shouldShowTranscriptExpandButton,
  onContinueToQuiz,
  onReplayAvatarVideo,
}: ListeningPanelProps) {
  return (
    <div
      className={`relative flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4 transition-all duration-500 ease-out ${
        isListeningStepTransitioning
          ? "opacity-0 translate-x-6"
          : "opacity-100 translate-x-0"
      }`}
    >
      <div className="lg:hidden flex justify-start">
        <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
          <Clock className="h-5 w-5 text-[#3EA4F9]" />
          <span>
            {sessionTimeRemaining !== null
              ? formatTime(sessionTimeRemaining)
              : "..."}
          </span>
        </div>
      </div>

      <div className="sticky top-0 z-10 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 lg:p-6">
        <div className="relative rounded-2xl bg-[#F8FAFC] border border-slate-200 overflow-hidden p-4 lg:p-6">
          {isAvatar3D && (
            <AvatarModeLayout
              key={`listening-avatar-${listeningAvatarSeed}`}
              syncPlaying={playingAudioId === "kb-audio" && isCurrentlyPlaying}
              videoSrc={avatarVideoSrc}
              heightClassName="h-auto"
              videoClassName="w-full h-auto object-contain"
            />
          )}
        </div>
        <div className="mt-4">
          <AudioPlayer
            audioSrc={listeningData?.kbAudioUrl || ""}
            isPlaying={playingAudioId === "kb-audio" && isCurrentlyPlaying}
            progress={playingAudioId === "kb-audio" ? audioProgress : 0}
            duration={playingAudioId === "kb-audio" ? audioDuration : 0}
            showTotal={true}
            onTogglePlay={() =>
              toggleAudio(
                "kb-audio",
                listeningData?.kbAudioUrl,
                handleKbAudioEnd,
              )
            }
          />
        </div>
      </div>

      {shouldShowListeningIntro && (
        <div className="rounded-2xl bg-white border border-[#B9E1FF] p-4 lg:p-5 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F3FF] px-3 py-1 text-sm font-semibold text-[#2B6CB0] mb-3">
            <Info className="h-4 w-4" />
            Listening Intro
          </div>
          <p className="text-sm text-[#2F4B66] whitespace-pre-wrap">
            {listeningData?.introText ||
              "Listen to the audio carefully. When you're ready, tap Next to continue."}
          </p>
        </div>
      )}

      {shouldShowListeningHint && (
        <div className="rounded-2xl bg-[#CFE9FF] border border-[#8CC7FF] p-4 lg:p-5 shadow-sm text-left">
          <div className="flex items-center gap-2 text-[#2B6CB0] font-semibold mb-2">
            <Info className="h-4 w-4" />
            Hints
          </div>
          {listeningHintText.length > 0 ? (
            <ul className="text-sm text-[#2F4B66] space-y-2 list-disc pl-5">
              {listeningHintText.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#2F4B66]">
              Hints will appear here as you progress.
            </p>
          )}
        </div>
      )}

      {listeningStage === "question_text" && !showListeningCompletionCard && (
        <div className="rounded-2xl bg-white border border-[#B9E1FF] p-4 lg:p-5 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F3FF] px-3 py-1 text-sm font-semibold text-[#2B6CB0] mb-3">
            <BookOpen className="h-4 w-4" />
            Character Transcript
          </div>
          <p
            ref={transcriptRef}
            className={`text-sm text-[#2F4B66] whitespace-pre-wrap transition-all duration-300 ${
              !isTranscriptExpanded ? "line-clamp-5" : "line-clamp-none"
            }`}
          >
            {listeningData?.questionText ||
              "Transcript will appear here as you progress."}
          </p>
          {shouldShowTranscriptExpandButton && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
              className="text-sm text-[#3EA4F9] p-0 h-auto mt-2"
            >
              {isTranscriptExpanded ? "See Less" : "See More"}
            </Button>
          )}
        </div>
      )}

      {showListeningCompletionCard && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-3 lg:px-6">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[720px] mx-auto text-center px-4 lg:px-8 py-6 bg-white border border-slate-200 rounded-2xl shadow-xl">
            <img
              src={birdWithHeadphones}
              alt="Listening helper"
              className="h-28 w-auto mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-[#2B3A67]">
              Done with it?
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Ready for the quiz? You can continue or replay the avatar
              explanation.
            </p>
            <Button
              className="w-full mt-5 rounded-full bg-[#5EA9FF] hover:bg-[#4E98F0] text-white"
              onClick={onContinueToQuiz}
            >
              Continue to Quiz
            </Button>
            <div className="mt-3">
              <Button
                variant="outline"
                className="w-full rounded-full text-gray-500 hover:bg-gray-100 h-10 px-3 md:px-4 text-[11px] sm:text-sm leading-none whitespace-nowrap min-w-0 justify-center gap-2"
                onClick={onReplayAvatarVideo}
                disabled={!listeningData?.kbAudioUrl}
              >
                Replay Avatar Video
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ListeningNextButton({
  listeningStage,
  disabled,
  onClick,
}: ListeningNextButtonProps) {
  return (
    <div className="w-full max-w-[800px] mx-auto">
      <Button
        className="w-full mt-4 rounded-full p-5 bg-[#5EA9FF] hover:bg-[#4E98F0] text-white flex items-center justify-center gap-2"
        onClick={onClick}
        disabled={disabled}
      >
        <span>{listeningStage === "quiz" ? "Submit Answer" : "Next"}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
