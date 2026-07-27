import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Mic, Send, Square, Trash2, Check, RotateCcw } from 'lucide-react';
import { useModeSession } from '@/hooks/useModeSession';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import ReadingPassageCard from '@/components/ui/ReadingPassageCard';

export default function ReadingModeTopics() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonModeId = searchParams.get('modeId') || '';
  
  const [inputValue, setInputValue] = useState('');
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    isRecording,
    recordTime,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder();

  const {
    chatHistory,
    contentPayload,
    mcqList,
    isTyping,
    isCompleted,
    sessionStatus,
    sendMessage,
    sendAudio,
    submitMcqs,
    restartSession
  } = useModeSession({ 
    lessonModeId,
    onCompleted: () => {
      // noop
    }
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleStopRecording = async () => {
    const res = await stopRecording();
    if (res) {
      sendAudio(res.audioBase64, res.format);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  return (
    <div className="w-full max-w-[1207px] mx-auto bg-white rounded-[24px] flex flex-col font-['Outfit',sans-serif] overflow-hidden h-[794px] max-h-[calc(100vh-40px)] border border-gray-100 shadow-sm">
      
      {/* Header Progress Group */}
      <div className="flex flex-col gap-2.5 pb-3">
        
        {/* Top Bar */}
        <div className="flex flex-row justify-between items-center px-6 py-4 bg-white border-b border-[#E5E7EB]">
          
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="flex justify-center items-center w-10 h-10 bg-white border border-[#E5E7EB] shadow-[0px_1px_4px_rgba(0,0,0,0.06)] rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#282828]" />
            </button>
          </div>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-[20px] font-bold leading-[20px] tracking-[-0.3px] text-[#282828]">
              Reading Mode
            </h1>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-3">
            {isCompleted && (
              <button
                onClick={() => {
                  setCurrentMcqIndex(0);
                  setSelectedAnswers({});
                  restartSession();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#5C9DFF] text-[#5C9DFF] hover:bg-[#EFF6FF] rounded-full font-['Outfit'] font-semibold text-[12px] transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Practice</span>
              </button>
            )}
            {sessionStatus.remainingSeconds !== null && (
              <div className="flex flex-row items-center px-4 py-2 gap-2 bg-[#FEF1E8] rounded-full h-[42px]">
                <span className="font-semibold text-[13px] leading-[16px] text-[#F97316]">
                  {Math.floor(sessionStatus.remainingSeconds / 60)}:{(sessionStatus.remainingSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Container (Figma Spec) */}
        <div className="flex flex-col px-8 gap-2.5 pt-3 flex-shrink-0">
          <div className="w-full h-3 bg-[#E5E7EB] rounded-[6px] relative overflow-hidden">
            <div 
              className="h-full bg-[#06CCB5] rounded-[6px] transition-all duration-500 ease-out"
              style={{ width: isCompleted ? '100%' : (mcqList && mcqList.length > 0 ? '80%' : '60%') }}
            />
          </div>
          <span className="font-['Outfit'] font-semibold text-[11px] leading-[14px] text-[#06CCB5]">
            {isCompleted ? '100%' : (mcqList && mcqList.length > 0 ? '80%' : '60%')} Complete
          </span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex flex-row px-8 gap-4 flex-1 min-h-0 pb-6">
        
        {/* Mode Sidebar */}
        <div className="flex flex-col py-4 w-[220px] bg-white border border-[#E5E7EB] rounded-[10px] flex-shrink-0">
          <div className="px-4 pb-2.5">
            <h3 className="font-semibold text-[10px] leading-[13px] tracking-[1.2px] text-[#6E748F] uppercase">
              Activity Steps
            </h3>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />
          
          {/* Step 1 */}
          <div className="relative flex flex-row items-center p-[14px_14px_14px_13px] gap-2.5 bg-[#5C9DFF]/10">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40px] bg-[#5C9DFF] rounded-[2px]" />
            <div className="flex justify-center items-center w-7 h-7 bg-[#5C9DFF] rounded-full text-white font-bold text-[12px]">
              1
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-[13px] leading-[16px] text-[#0F1450]">Reading Passage</span>
              <span className="text-[11px] leading-[14px] text-[#5C9DFF]">In Progress</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E5E7EB]/70" />
        </div>

        {/* Workspace Main */}
        <div className="flex flex-col flex-1 gap-4 min-h-0 overflow-y-auto pr-1">
          
          {/* Reading Passage Card */}
          {contentPayload && (contentPayload.passage || contentPayload.content) && (
            <div className="flex-shrink-0">
              <ReadingPassageCard 
                content={contentPayload.passage || contentPayload.content || ''}
                audioUrl={contentPayload.attachmentUrl}
              />
            </div>
          )}

          {/* Chat History Area (Shown during Chatting stage, hidden during Quiz stage to prevent squishing) */}
          {(!mcqList || mcqList.length === 0) && (
            <div 
              ref={chatContainerRef}
              className="flex flex-col p-5 px-6 gap-3 flex-1 min-h-0 bg-[#F8F9FA] rounded-2xl overflow-y-auto"
            >
              {chatHistory.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1 w-full mt-2`}
                >
                  <div 
                    className={`px-4 py-3 max-w-[85%] text-left ${
                      msg.role === 'user' 
                        ? 'bg-[#DBEAFE] rounded-tl-xl rounded-bl-xl rounded-br-sm rounded-tr-xl' 
                        : 'bg-[#F1F5F9] rounded-tr-xl rounded-br-xl rounded-bl-sm rounded-tl-xl'
                    }`}
                  >
                    <p className="text-[13px] leading-[18px] text-[#0F1450] whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  {msg.createdAt && (
                    <span className="text-[10px] leading-[13px] text-[#6E748F]/60">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start gap-1 w-full mt-2">
                  <div className="px-4 py-3 bg-[#F1F5F9] rounded-tr-xl rounded-br-xl rounded-bl-sm rounded-tl-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MCQs Area (Figma Spec) */}
          {mcqList && mcqList.length > 0 && (
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
                          onClick={() => setCurrentMcqIndex(prev => prev + 1)}
                          disabled={currentAnswer === undefined}
                          className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-full font-['Outfit'] font-semibold text-[14px] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const answers = mcqList.map((_, idx) => selectedAnswers[idx] ?? -1);
                            submitMcqs(answers);
                          }}
                          disabled={Object.keys(selectedAnswers).length < mcqList.length}
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

          {/* Input Bar (Shown only during Chatting stage) */}
          {(!mcqList || mcqList.length === 0) && (
            <div className="flex flex-row items-center px-5 py-4 gap-3 bg-white border border-[#E5E7EB] rounded-2xl flex-shrink-0">
              {isRecording ? (
                <div className="flex-1 flex items-center justify-between px-4 py-2 bg-[#FEF1E8] border border-[#F97316]/30 rounded-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse" />
                    <span className="text-[13px] font-semibold text-[#F97316]">
                      Recording... {Math.floor(recordTime / 60)}:{(recordTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={cancelRecording}
                      className="p-1.5 text-[#6E748F] hover:text-red-500 transition-colors rounded-full"
                      title="Cancel Recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleStopRecording}
                      className="flex justify-center items-center w-8 h-8 bg-[#F97316] rounded-full text-white hover:bg-[#EA580C] transition-colors shadow-sm"
                      title="Send Recording"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Write your message..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] text-[#282828] placeholder-[#6E748F]/60 focus:outline-none focus:border-[#5C9DFF] focus:ring-1 focus:ring-[#5C9DFF] transition-all"
                  />
                  {inputValue.trim() ? (
                    <button 
                      onClick={handleSend}
                      className="flex justify-center items-center w-11 h-11 bg-[#5C9DFF] rounded-full text-white hover:bg-[#4A8BEB] transition-colors"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  ) : (
                    <button 
                      onClick={startRecording}
                      className="flex justify-center items-center w-11 h-11 bg-white border border-[#5C9DFF] rounded-full text-[#5C9DFF] hover:bg-[#EFF6FF] transition-colors"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
