import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Play, Circle, PlayCircle, Clock, Check } from 'lucide-react';
import { useModeSession } from '@/hooks/useModeSession';
import TopicCompletionModal from '@/components/ui/TopicCompletionModal';
import { toast } from 'sonner';

export default function ListeningModeTopics() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonModeId = searchParams.get('modeId') || '';
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasListenedToAudio, setHasListenedToAudio] = useState(false);
  const [isJustCompleted, setIsJustCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const {
    modeSessionId,
    listeningPayload,
    mcqList,
    isCompleted,
    isAccountBlocked,
    sessionStatus,
    startListening,
    nextListeningStage,
    submitMcqs,
    restartSession
  } = useModeSession({ 
    lessonModeId,
    onCompleted: () => {
      setIsJustCompleted(true);
      setShowCompletionModal(true);
    }
  });

  useEffect(() => {
    if (isCompleted && !isJustCompleted) {
      setShowCompletionModal(true);
    }
  }, [isCompleted, isJustCompleted]);

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (modeSessionId && !listeningPayload && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startListening();
    }
  }, [modeSessionId, listeningPayload, startListening]);

  useEffect(() => {
    setHasListenedToAudio(false);
  }, [listeningPayload?.stage]);

  useEffect(() => {
    if (modeSessionId) {
      hasStartedRef.current = false;
    }
  }, [modeSessionId]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const getProgressPercentage = () => {
    if (isCompleted) return 100;
    if (listeningPayload?.stage === 'quiz' && mcqList && mcqList.length > 0) {
      const quizProgress = Math.floor(((currentMcqIndex + 1) / mcqList.length) * 25);
      return Math.min(99, 75 + quizProgress);
    }
    if (listeningPayload?.stage === 'question') return 50;
    if (listeningPayload?.stage === 'initial') return 25;
    return 0;
  };

  const activeAudioUrl = listeningPayload?.stage === 'question' ? listeningPayload?.questionAudioUrl : listeningPayload?.narrationAudioUrl;
  const activeText = listeningPayload?.stage === 'question' ? listeningPayload?.questionText : listeningPayload?.narrationText;

  return (
    <div className="w-full max-w-[1207px] mx-auto bg-white rounded-none md:rounded-[24px] flex flex-col font-['Outfit',sans-serif] overflow-hidden h-[100dvh] md:h-[794px] max-h-[calc(100vh-40px)] border border-gray-100 shadow-sm relative">
      
      <TopicCompletionModal 
        isOpen={showCompletionModal}
        isJustCompleted={isJustCompleted}
        onFinish={() => {
          setShowCompletionModal(false);
          navigate('/student/courses');
        }}
        onRetake={() => {
          setShowCompletionModal(false);
          setCurrentMcqIndex(0);
          setSelectedAnswers({});
          setHasListenedToAudio(false);
          setIsJustCompleted(false);
          restartSession();
        }}
        onReview={() => setShowCompletionModal(false)}
      />

      {/* Header Progress Group */}
      <div className="flex flex-col gap-2.5 pb-3">
        
        {/* Top Bar */}
        <div className="flex flex-row justify-between items-center px-4 md:px-6 py-4 bg-white border-b border-[#E5E7EB]">
          
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="flex justify-center items-center w-10 h-10 bg-white border border-[#E5E7EB] shadow-[0px_1px_4px_rgba(0,0,0,0.06)] rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#282828]" />
            </button>
          </div>
          
          <div className="flex-1 flex justify-center items-center gap-4">
            <h1 className="text-[20px] font-bold leading-[20px] tracking-[-0.3px] text-[#282828]">
              Listening Mode
            </h1>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-3">
            {sessionStatus.remainingSeconds !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F97316]/30 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="font-semibold text-[13px] leading-[16px] text-[#F97316]">
                  {Math.floor(sessionStatus.remainingSeconds / 60)}:{(sessionStatus.remainingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Container (Figma Spec) */}
        <div className="flex flex-col px-4 md:px-8 gap-2.5 pt-3 flex-shrink-0">
          <div className="w-full h-3 bg-[#E5E7EB] rounded-[6px] relative overflow-hidden">
            <div 
              className="h-full bg-[#06CCB5] rounded-[6px] transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <span className="font-['Outfit'] font-semibold text-[11px] leading-[14px] text-[#06CCB5]">
            {getProgressPercentage()}% Complete
          </span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 gap-4 flex-1 min-h-0 pb-6">
        
        {/* Mode Sidebar */}
        <div className="flex flex-col py-4 w-full md:w-[220px] bg-white border border-[#E5E7EB] rounded-[10px] flex-shrink-0">
          <div className="px-4 pb-2.5">
            <h3 className="font-semibold text-[10px] leading-[13px] tracking-[1.2px] text-[#6E748F] uppercase">
              Activity Steps
            </h3>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />
          
          {/* Step 1: Audio Narration */}
          <div className={`relative flex flex-row items-center p-[14px_14px_14px_13px] gap-2.5 ${
            listeningPayload?.stage === 'initial' && !isCompleted ? 'bg-[#5C9DFF]/10' : ''
          }`}>
            {listeningPayload?.stage === 'initial' && !isCompleted && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40px] bg-[#5C9DFF] rounded-[2px]" />
            )}
            <div className={`flex justify-center items-center w-7 h-7 rounded-full font-bold text-[12px] ${
              (listeningPayload?.stage && listeningPayload.stage !== 'initial') || isCompleted ? 'bg-[#2DCD6B] text-white' : 'bg-[#5C9DFF] text-white'
            }`}>
              1
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[13px] leading-[16px] text-[#0F1450]">Audio Narration</span>
              <span className={`text-[11px] leading-[14px] font-medium ${
                (listeningPayload?.stage && listeningPayload.stage !== 'initial') || isCompleted ? 'text-[#2DCD6B]' : 'text-[#5C9DFF]'
              }`}>
                {(listeningPayload?.stage && listeningPayload.stage !== 'initial') || isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />

          {/* Step 2: Comprehension Question */}
          <div className={`relative flex flex-row items-center p-[14px_14px_14px_13px] gap-2.5 ${
            listeningPayload?.stage === 'question' && !isCompleted ? 'bg-[#5C9DFF]/10' : ''
          }`}>
            {listeningPayload?.stage === 'question' && !isCompleted && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40px] bg-[#5C9DFF] rounded-[2px]" />
            )}
            <div className={`flex justify-center items-center w-7 h-7 rounded-full font-bold text-[12px] ${
              listeningPayload?.stage === 'quiz' || isCompleted ? 'bg-[#2DCD6B] text-white' : (listeningPayload?.stage === 'question' ? 'bg-[#5C9DFF] text-white' : 'bg-[#E5E7EB] text-[#6E748F]')
            }`}>
              2
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[13px] leading-[16px] text-[#0F1450]">Comprehension Question</span>
              <span className={`text-[11px] leading-[14px] font-medium ${
                listeningPayload?.stage === 'quiz' || isCompleted ? 'text-[#2DCD6B]' : (listeningPayload?.stage === 'question' ? 'text-[#5C9DFF]' : 'text-[#6E748F]')
              }`}>
                {listeningPayload?.stage === 'quiz' || isCompleted ? 'Completed' : (listeningPayload?.stage === 'question' ? 'In Progress' : 'Pending')}
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />

          {/* Step 3: Listening Quiz */}
          <div className={`relative flex flex-row items-center p-[14px_14px_14px_13px] gap-2.5 ${
            listeningPayload?.stage === 'quiz' && !isCompleted ? 'bg-[#5C9DFF]/10' : ''
          }`}>
            {listeningPayload?.stage === 'quiz' && !isCompleted && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40px] bg-[#5C9DFF] rounded-[2px]" />
            )}
            <div className={`flex justify-center items-center w-7 h-7 rounded-full font-bold text-[12px] ${
              isCompleted ? 'bg-[#2DCD6B] text-white' : (listeningPayload?.stage === 'quiz' ? 'bg-[#5C9DFF] text-white' : 'bg-[#E5E7EB] text-[#6E748F]')
            }`}>
              3
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[13px] leading-[16px] text-[#0F1450]">Listening Quiz</span>
              <span className={`text-[11px] leading-[14px] font-medium ${
                isCompleted ? 'text-[#2DCD6B]' : (listeningPayload?.stage === 'quiz' ? 'text-[#5C9DFF]' : 'text-[#6E748F]')
              }`}>
                {isCompleted ? 'Completed' : (listeningPayload?.stage === 'quiz' ? 'In Progress' : 'Pending')}
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />

        </div>

        {/* Workspace Main */}
        <div className="flex flex-col flex-1 gap-4 min-h-0 overflow-y-auto">
          
          {/* Audio Player Card */}
          {activeAudioUrl && (
            <div className="flex flex-col p-4 px-5 gap-3.5 bg-white border-2 border-[#5C9DFF] rounded-xl">
              <audio 
                ref={audioRef} 
                src={activeAudioUrl} 
                onEnded={() => {
                  setIsPlaying(false);
                  setHasListenedToAudio(true);
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              <div className="flex flex-row justify-between items-center w-full">
                <span className="font-bold text-[14px] leading-[18px] text-[#5C9DFF]">Audio Track</span>
              </div>
              
              <div className="flex flex-row items-center gap-3">
                <button 
                  onClick={toggleAudio}
                  className="flex justify-center items-center w-9 h-9 bg-[#5C9DFF] rounded-full text-white hover:bg-[#4A8BEB] transition-colors"
                >
                  {isPlaying ? <Circle className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                
                <div className="flex-1 flex flex-row items-center gap-1 overflow-hidden h-8">
                  {/* Mock Waveform for visual flair */}
                  {[8, 16, 24, 12, 20, 28, 16, 10, 22, 32, 18, 14, 26, 8, 20, 32, 24, 12, 18, 28, 10, 22, 16, 8, 30, 20, 14, 24, 10, 18].map((height, i) => (
                    <div key={i} className={`w-[3px] rounded-sm transition-all duration-300 ${isPlaying ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#BFDBFE]'}`} style={{ height: `${height}px` }} />
                  ))}
                  {[8, 16, 24, 12, 20, 28, 16, 10, 22, 32, 18, 14, 26, 8, 20, 32, 24, 12, 18, 28, 10, 22, 16, 8, 30, 20, 14, 24, 10, 18].map((height, i) => (
                    <div key={i + 30} className={`w-[3px] rounded-sm transition-all duration-300 ${isPlaying ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#BFDBFE]'}`} style={{ height: `${height}px` }} />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex items-center gap-1">
                  <PlayCircle className="w-2.5 h-2.5 text-[#5C9DFF]" />
                  <span className="font-normal text-[11px] leading-[14px] text-[#5C9DFF]">Play to listen</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Transcript Area (if available and not quiz stage) */}
          {activeText && listeningPayload?.stage !== 'quiz' && (
            <div className="flex flex-col p-5 px-6 gap-2 flex-1 bg-[#F8F9FA] rounded-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 bg-[#5C9DFF] rounded-full" />
                <span className="font-semibold text-[12px] leading-[15px] text-[#6E748F]">Narrator</span>
              </div>
              
              <div className="p-3.5 px-4 bg-white border-[1.5px] border-[#DBEAFE] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-sm w-full">
                <p className="font-normal text-[14px] leading-[22px] text-[#0F1450]">
                  {activeText}
                </p>
              </div>
            </div>
          )}

          {/* MCQs Area (Figma Spec) */}
          {listeningPayload?.stage === 'quiz' && mcqList && mcqList.length > 0 && (
            <div className="w-full bg-white border border-[#E5E7EB] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] rounded-[12px] p-6 flex flex-col gap-6 flex-shrink-0 font-['Outfit',sans-serif]">
              
              {/* Quiz Header Row */}
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row items-center gap-4">
                  {/* Status Icon */}
                  <div className="w-9 h-9 bg-[#DBEAFE] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-[#3B82F6] stroke-[2.5]" />
                  </div>
                  {/* Text Stack */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-['Outfit'] font-semibold text-[11px] leading-[14px] tracking-[1.2px] text-[#6E748F] uppercase">
                      STEP 4: QUIZ
                    </span>
                    <h3 className="font-['Outfit'] font-bold text-[18px] leading-[23px] text-[#0F1450]">
                      Test Your Knowledge
                    </h3>
                  </div>
                </div>

                {/* Progress Pill */}
                <div className="px-2.5 py-1 bg-[#F3F4F6] rounded-[20px] font-['Outfit'] font-semibold text-[11px] leading-[14px] text-[#6E748F]">
                  {currentMcqIndex + 1}/{mcqList.length}
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const mcq = mcqList[currentMcqIndex] || mcqList[0];
                const currentAnswer = selectedAnswers[currentMcqIndex];

                return (
                  <div className="flex flex-col gap-4 w-full">
                    {/* Question Text */}
                    <h4 className="font-['Outfit'] font-bold text-[16px] leading-[24px] text-[#0F1450]">
                      {mcq.question}
                    </h4>

                    {/* Options List */}
                    <div className="flex flex-col gap-2 w-full">
                      {mcq.options.map((opt, oIdx) => {
                        const optVal = typeof opt === 'string' ? oIdx : opt.id;
                        const isSelected = currentAnswer === optVal;
                        const optLabel = typeof opt === 'string' ? opt : opt.text;

                        return (
                          <div
                            key={oIdx}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentMcqIndex]: optVal }))}
                            className={`w-full p-[14px_16px] rounded-[10px] flex flex-row items-center gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#3B82F6] border border-[#3B82F6] text-white shadow-sm'
                                : 'bg-white border border-[#E5E7EB] text-[#0F1450] hover:border-[#3B82F6]/40'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected ? 'bg-white' : 'border-[1.5px] border-[#9CA3AF]'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-[#3B82F6] stroke-[3]" />}
                            </div>
                            <span className={`text-[14px] leading-[18px] flex-1 ${isSelected ? 'font-bold text-white' : 'font-normal text-[#0F1450]'}`}>
                              {optLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                      {currentMcqIndex < mcqList.length - 1 ? (
                        <button
                          onClick={() => {
                            const isCorrect = currentAnswer === mcq.correct || currentAnswer === mcq.correctOptionId;
                            if (!isCorrect) {
                              toast.error('Incorrect answer! Please try again.');
                              return;
                            }
                            setCurrentMcqIndex(prev => prev + 1);
                          }}
                          disabled={currentAnswer === undefined || isAccountBlocked}
                          className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-full font-['Outfit'] font-semibold text-[14px] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const isCorrect = currentAnswer === mcq.correct || currentAnswer === mcq.correctOptionId;
                            if (!isCorrect) {
                              toast.error('Incorrect answer! Please try again.');
                              return;
                            }
                            const answers = mcqList.map((_, idx) => selectedAnswers[idx] ?? -1);
                            submitMcqs(answers);
                          }}
                          disabled={Object.keys(selectedAnswers).length < mcqList.length || isAccountBlocked}
                          className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-full font-['Outfit'] font-semibold text-[14px] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Submit Answers
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
          
          {/* Next Button for transitioning stages (except quiz) */}
          {listeningPayload?.stage !== 'quiz' && (
            <div className="flex justify-center items-center pt-2 mt-auto">
              <button 
                onClick={() => nextListeningStage()}
                disabled={!hasListenedToAudio || isAccountBlocked}
                className="flex justify-center items-center w-full max-w-[200px] h-[52px] bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] transition-colors rounded-full font-bold text-[16px] leading-[20px] text-white"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
