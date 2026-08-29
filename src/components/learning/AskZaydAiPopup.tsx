import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Bot,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Lightbulb,
  Gamepad2,
  FileText,
  Smile,
  Copy,
  Check,
  ShieldCheck,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  Send,
  Link2,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import {
  AskZaydUnitContext,
  AskZaydDecision,
  AskZaydAttachment,
} from '@/types/askZayd';
import { askZaydService } from '@/services/askZaydService';

export interface AskZaydAiPopupProps {
  unitId?: string;
  unitTitle?: string;
  courseTitle?: string;
  launchLessonId?: string;
  launcherPlacement: 'unit_lessons' | 'lesson_modes';
  defaultOpen?: boolean;
}

interface DisplayMessage {
  id: string;
  sender: 'learner' | 'assistant' | 'system';
  inputType?: 'text' | 'audio' | 'attachment' | string;
  content: string;
  decision?: AskZaydDecision | null;
  createdAt?: string;
  attachments?: AskZaydAttachment[];
}

export default function AskZaydAiPopup({
  unitId,
  unitTitle = 'Unit Lessons',
  courseTitle: _courseTitle,
  launchLessonId,
  launcherPlacement,
  defaultOpen = false,
}: AskZaydAiPopupProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  // Context & Availability
  const [context, setContext] = useState<AskZaydUnitContext | null>(null);

  // Panel State
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [isSidebar, setIsSidebar] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConv, setIsLoadingConv] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Messages & Composer State
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attachments & Voice State
  const [pendingAttachments, setPendingAttachments] = useState<AskZaydAttachment[]>([]);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Guard to prevent concurrent / duplicate initializations
  const isInitializingRef = useRef<boolean>(false);

  const studentName = user?.name || user?.username || 'Learner';
  const studentInitials =
    studentName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Unit Context on Mount or when unitId changes
  useEffect(() => {
    setContext(null);
    setConversationId(null);
    setMessages([]);
    setPendingAttachments([]);
    setInitError(null);
    if (!unitId) return;

    let isMounted = true;
    const fetchContext = async () => {
      try {
        const data = await askZaydService.getContext(unitId);
        if (isMounted) {
          setContext(data);
        }
      } catch (err) {
        console.warn('Could not load Ask Zayd context:', err);
        if (isMounted) {
          setContext(null);
        }
      }
    };

    fetchContext();
    return () => {
      isMounted = false;
    };
  }, [launcherPlacement, unitId]);

  // 2. Initialize or Resume Conversation
  const initConversation = useCallback(async (): Promise<string | null> => {
    if (
      !unitId ||
      !context?.available ||
      context.launcherPlacement !== launcherPlacement ||
      isInitializingRef.current
    ) {
      return conversationId;
    }

    try {
      isInitializingRef.current = true;
      setIsLoadingConv(true);
      setInitError(null);

      const result = await askZaydService.createOrResumeConversation(
        unitId,
        launchLessonId,
      );
      const convId = result.conversation.id;
      setConversationId(convId);
      if (result.context) {
        setContext(result.context);
      }

      if (result.resumed) {
        const detail = await askZaydService.getConversation(convId);
        if (detail.conversation.messages && detail.conversation.messages.length > 0) {
          const parsedMsgs: DisplayMessage[] = detail.conversation.messages
            // Attachment upload bookkeeping is an internal system event, not a
            // tutor reply. Keeping it out of the transcript avoids a reload
            // presenting it as though Ask Zayd had written it.
            .filter((m) => m.sender !== 'system')
            .map((m) => ({
              id: m.id,
              sender: m.sender,
              inputType: m.inputType,
              content: m.content,
              decision: m.decision,
              createdAt: m.createdAt,
              attachments: m.attachments,
            }));
          setMessages(parsedMsgs);
          return convId;
        }
      }

      // Fresh conversation default welcome
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          sender: 'assistant',
          content: `Hi ${studentName}! I am connected to the published study materials for ${
            result.context.unit.title || unitTitle
          }. I can guide you through concepts, answer questions grounded in your lesson materials, or break down difficult topics. How can I help you today?`,
          createdAt: new Date().toISOString(),
        },
      ]);
      return convId;
    } catch (err: any) {
      console.error('Failed to init Ask Zayd conversation:', err);
      const errorMsg =
        err.response?.data?.message || 'Ask Zayd is not available for this Unit yet.';
      setInitError(errorMsg);
      return null;
    } finally {
      setIsLoadingConv(false);
      isInitializingRef.current = false;
    }
  }, [
    unitId,
    conversationId,
    studentName,
    context?.available,
    context?.launcherPlacement,
    launchLessonId,
    launcherPlacement,
    unitTitle,
  ]);

  // Trigger init when popup is opened
  useEffect(() => {
    if (isOpen && unitId && !conversationId && !isLoadingConv && !initError) {
      initConversation();
    }
  }, [isOpen, unitId, conversationId, isLoadingConv, initError, initConversation]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  // 3. Send Text Question
  const handleSendMessage = async (textToSend?: string) => {
    if (isTyping || isProcessingVoice || isUploadingAttachment || isLoadingConv) {
      return;
    }
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    if (text.length > 2000) {
      toast.error('Question is too long (maximum 2,000 characters).');
      return;
    }

    let activeConvId = conversationId;
    if (!activeConvId) {
      activeConvId = await initConversation();
      if (!activeConvId) {
        toast.error('Unable to establish session. Please verify unit availability.');
        return;
      }
    }

    const tempUserMsg: DisplayMessage = {
      id: `usr-${Date.now()}`,
      sender: 'learner',
      inputType: 'text',
      content: text,
      createdAt: new Date().toISOString(),
      attachments: [...pendingAttachments],
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputVal('');
    const attachmentIdsToSend = pendingAttachments.map((a) => a.id);
    setPendingAttachments([]);
    setIsTyping(true);

    try {
      const response = await askZaydService.sendTextMessage(
        activeConvId,
        text,
        attachmentIdsToSend.length > 0 ? attachmentIdsToSend : undefined
      );

      const botMsg: DisplayMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        inputType: 'text',
        content: response.answer.message,
        decision: response.answer.decision,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send question. Please try again.';
      toast.error(msg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick Prompt buttons
  const handleQuickPrompt = (promptType: 'hint' | 'practice' | 'handout' | 'simplify') => {
    switch (promptType) {
      case 'hint':
        handleSendMessage('Can you give me a Socratic hint to help me think through the key concept in this unit?');
        break;
      case 'practice':
        handleSendMessage('Can you give me a practice problem based on the published lessons in this unit?');
        break;
      case 'handout':
        handleSendMessage('Can you provide a structured study handout summarizing the essential points of this unit?');
        break;
      case 'simplify':
        handleSendMessage('Can you explain the main lesson in this unit in simple, beginner terms?');
        break;
    }
  };

  // Upload Attachment (Image or PDF)
  const handleFileUpload = async (file: File) => {
    if (isTyping || isProcessingVoice || isUploadingAttachment || isLoadingConv) {
      return;
    }
    if (!conversationId) {
      toast.error('Session not initialized yet.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }

    if (pendingAttachments.length >= 3) {
      toast.error('Maximum 3 attachments per question.');
      return;
    }

    try {
      setIsUploadingAttachment(true);
      const res = await askZaydService.uploadAttachment(conversationId, file);
      setPendingAttachments((prev) => [...prev, res.attachment]);
      toast.success(`Attached "${file.name}"`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to upload attachment.';
      toast.error(errorMsg);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  // Voice Recording Handling
  const handleStartVoice = async () => {
    if (isTyping || isProcessingVoice || isUploadingAttachment || isLoadingConv) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        if (!conversationId) {
          toast.error('Session not initialized yet.');
          return;
        }

        try {
          setIsProcessingVoice(true);
          const res = await askZaydService.sendAudioMessage(
            conversationId,
            audioBlob,
            'voice-question.webm'
          );

          // Add user transcript message
          if (res.attachment?.transcript) {
            setMessages((prev) => [
              ...prev,
              {
                id: `usr-${Date.now()}`,
                sender: 'learner',
                inputType: 'audio',
                content: res.attachment.transcript || 'Voice question',
                createdAt: new Date().toISOString(),
              },
            ]);
          }

          // Add bot response
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'assistant',
              inputType: 'text',
              content: res.answer.message,
              decision: res.answer.decision,
              createdAt: new Date().toISOString(),
            },
          ]);
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Failed to process voice question.';
          toast.error(msg);
        } finally {
          setIsProcessingVoice(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started… Speak your question now.');
    } catch (err) {
      console.error('Microphone error:', err);
      toast.error('Microphone access denied or unavailable.');
    }
  };

  const handleStopVoice = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCopyNote = (textToCopy: string, id: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    toast.success('Text copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const canRenderLauncher =
    !!unitId &&
    context?.available === true &&
    context.launcherPlacement === launcherPlacement;

  if (!canRenderLauncher) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setInitError(null);
          }}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/40 cursor-pointer"
          title="Ask Zayd AI Tutor"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse" />
          </div>
          <div className="text-left font-['Outfit',sans-serif]">
            <p className="text-xs font-bold leading-none tracking-wide">Ask Zayd AI</p>
            <p className="text-[10px] text-blue-100 font-medium leading-tight">Instant Unit Tutor</p>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Main Ask Zayd Container */}
      {isOpen && (
        <aside
          className={`font-['Outfit',sans-serif] bg-white flex flex-col z-[60] transition-all duration-300 ${
            isSidebar
              ? 'fixed top-0 right-0 h-screen w-full max-w-[420px] shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300'
              : 'fixed bottom-6 right-6 h-[640px] max-h-[calc(100vh-48px)] w-[calc(100vw-32px)] max-w-[420px] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-4 shrink-0 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full" />
                </div>
                <div>
                  <h2 className="text-base font-bold leading-tight flex items-center gap-1.5">
                    Ask Zayd
                    <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      AI Tutor
                    </span>
                  </h2>
                  <div className="flex items-center gap-1.5 opacity-90 mt-0.5">
                    <Link2 className="w-3 h-3 text-blue-200 shrink-0" />
                    <span className="text-[11px] font-semibold text-blue-100 line-clamp-1">
                      {context?.unit?.title || unitTitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Layout Switcher (Popup <-> Sidebar) */}
                <button
                  onClick={() => setIsSidebar((prev) => !prev)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-white/90 hover:text-white cursor-pointer"
                  title={isSidebar ? 'Switch to Floating Popup' : 'Dock to Right Sidebar'}
                >
                  {isSidebar ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-white/90 hover:text-white cursor-pointer"
                  title="Close Ask Zayd"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions (Scrollable Ribbon) */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide snap-x">
              <button
                onClick={() => handleQuickPrompt('hint')}
                disabled={Boolean(initError) || isLoadingConv || isTyping || isProcessingVoice || isUploadingAttachment}
                className="snap-start shrink-0 bg-white/15 hover:bg-white/25 disabled:opacity-50 border border-white/25 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> Socratic Hint
              </button>
              <button
                onClick={() => handleQuickPrompt('practice')}
                disabled={Boolean(initError) || isLoadingConv || isTyping || isProcessingVoice || isUploadingAttachment}
                className="snap-start shrink-0 bg-white/15 hover:bg-white/25 disabled:opacity-50 border border-white/25 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-300" /> Practice Mode
              </button>
              <button
                onClick={() => handleQuickPrompt('handout')}
                disabled={Boolean(initError) || isLoadingConv || isTyping || isProcessingVoice || isUploadingAttachment}
                className="snap-start shrink-0 bg-white/15 hover:bg-white/25 disabled:opacity-50 border border-white/25 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-blue-300" /> Handouts
              </button>
              <button
                onClick={() => handleQuickPrompt('simplify')}
                disabled={Boolean(initError) || isLoadingConv || isTyping || isProcessingVoice || isUploadingAttachment}
                className="snap-start shrink-0 bg-white/15 hover:bg-white/25 disabled:opacity-50 border border-white/25 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Smile className="w-3.5 h-3.5 text-rose-300" /> Explain Simply
              </button>
            </div>
          </div>

          {/* Chat History Scroll Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-4 text-sm"
          >
            {/* Error or Unavailable State */}
            {initError && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3 animate-in fade-in duration-200">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="text-sm font-bold text-amber-900">Ask Zayd Unavailable</h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {initError}
                </p>
                <button
                  onClick={() => initConversation()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Connection
                </button>
              </div>
            )}

            {isLoadingConv && !initError && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-xs font-medium">Connecting to your lesson materials…</p>
              </div>
            )}

            {!isLoadingConv &&
              !initError &&
              messages.map((msg) => {
                if (msg.sender === 'learner') {
                  return (
                    <div key={msg.id} className="flex gap-2.5 flex-row-reverse items-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
                        {studentInitials}
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs p-3.5 shadow-sm max-w-[82%] space-y-2">
                        <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/20">
                            {msg.attachments.map((att) => (
                              <span
                                key={att.id}
                                className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium text-white/90"
                              >
                                <Paperclip className="w-2.5 h-2.5" />
                                {att.fileName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Assistant / System Message
                return (
                  <div key={msg.id} className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center shrink-0 text-blue-600 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>

                    <div className="max-w-[85%] space-y-2">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-sm space-y-2.5">
                        {/* Decision Callout Badge if not standard grounded */}
                        {msg.decision === 'outside_unit' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2 text-amber-800 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>This topic is outside the published Unit materials.</span>
                          </div>
                        )}
                        {msg.decision === 'anti_cheating_redirect' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2 text-blue-800 text-[11px]">
                            <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>Here is learning guidance to help you find the solution yourself!</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>

                      {/* Export Toolbar */}
                      <div className="flex items-center gap-1.5 ml-1">
                        <button
                          onClick={() => handleCopyNote(msg.content, msg.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-indigo-50 border border-transparent hover:border-indigo-100 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Typing / Processing Indicator */}
            {(isTyping || isProcessingVoice) && (
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                  {isProcessingVoice && (
                    <span className="text-[11px] font-medium text-slate-500 ml-1">
                      Transcribing your voice question…
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rich Input Area */}
          <div className="bg-white border-t border-slate-200 p-3 shrink-0">
            {/* Guardrail status badge */}
            <div className="flex justify-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Guardrails Active
              </span>
            </div>

            {/* Pending Attachments preview */}
            {pendingAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 px-1">
                {pendingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3 h-3" />
                    <span className="max-w-[150px] truncate">{att.fileName}</span>
                    <button
                      onClick={() =>
                        setPendingAttachments((prev) => prev.filter((a) => a.id !== att.id))
                      }
                      className="text-slate-400 hover:text-slate-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                maxLength={2000}
                disabled={Boolean(initError) || isLoadingConv || isTyping || isProcessingVoice || isUploadingAttachment}
                placeholder="Ask a question about this unit's lessons…"
                className="w-full bg-transparent p-3 text-xs text-slate-800 outline-none resize-none font-medium placeholder:text-slate-400 disabled:opacity-50"
              />

              {/* Action Bar (Attachments, Voice & Send) */}
              <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                <div className="flex items-center gap-1">
                  {/* Voice recording */}
                  <button
                    onClick={isRecording ? handleStopVoice : handleStartVoice}
                    disabled={isTyping || isProcessingVoice || isUploadingAttachment || Boolean(initError) || isLoadingConv}
                    className={`w-7 h-7 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'hover:bg-slate-200 text-slate-500'
                    }`}
                    title={isRecording ? 'Stop recording voice question' : 'Ask with Voice'}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  {/* Camera / Image Upload */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isTyping || isProcessingVoice || isUploadingAttachment || Boolean(initError) || isLoadingConv}
                    className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40"
                    title="Upload Photo of Work"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Document Attachment (PDF or Image) */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isTyping || isProcessingVoice || isUploadingAttachment || Boolean(initError) || isLoadingConv}
                    className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40"
                    title="Attach Study Document (PDF or Image)"
                  >
                    {isUploadingAttachment ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Paperclip className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={
                    !inputVal.trim() ||
                    isTyping ||
                    isProcessingVoice ||
                    isUploadingAttachment ||
                    Boolean(initError) ||
                    isLoadingConv
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Send question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
