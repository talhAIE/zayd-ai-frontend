import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { ContentFilterWarningData } from '@/components/ui/ContentPolicyWarningModal';

export interface HistoryItem {
  id: string;
  sender: string;
  role: 'assistant' | 'user';
  content: string;
  hint: string | null;
  feedback: string | null;
  assessments: any | null;
  audioUrl: string | null;
  createdAt: string;
}

export interface Mcq {
  id: string;
  question: string;
  options: string[] | Array<{ id: string; text: string }>;
  hint?: string;
  correct?: string | number;
  correctOptionId?: string;
}

export interface ReadingProgress {
  phase: 'reading' | 'quiz' | 'completed';
  currentSentenceIndex: number;
  totalSentences: number;
  acceptedSentenceIndexes: number[];
  rejectedAttemptCount: number;
  percentComplete: number;
}

export interface SessionStatus {
  remainingSeconds: number | null;
  message?: string;
}

export interface UseModeSessionOptions {
  lessonModeId: string;
  onCompleted?: () => void;
  onBadgeUnlocked?: (badge: any) => void;
}

export function useModeSession({ lessonModeId, onCompleted, onBadgeUnlocked }: UseModeSessionOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [modeSessionId, setModeSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [contentPayload, setContentPayload] = useState<any>(null);
  const [mcqList, setMcqList] = useState<Mcq[]>([]);
  const [listeningPayload, setListeningPayload] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({ remainingSeconds: null });
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [isContentFilterWarningOpen, setIsContentFilterWarningOpen] = useState(false);
  const [contentFilterWarningData, setContentFilterWarningData] = useState<ContentFilterWarningData | null>(null);
  const [isAccountBlocked, setIsAccountBlocked] = useState(false);

  // Refs for tracking mutable state within socket handlers without needing to re-bind
  const modeSessionIdRef = useRef<string | null>(null);
  const completionHandledRef = useRef(false);
  const onCompletedRef = useRef(onCompleted);
  const onBadgeUnlockedRef = useRef(onBadgeUnlocked);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
    onBadgeUnlockedRef.current = onBadgeUnlocked;
  }, [onBadgeUnlocked, onCompleted]);

  useEffect(() => {
    if (!lessonModeId) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    const newSocket = io(socketUrl, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      newSocket.emit('start_mode_session', { lessonModeId });
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connect error:', err);
      toast.error('Failed to connect to the learning server');
    });

    newSocket.on('mode_session_started', (session) => {
      console.log('[Socket] Mode session started:', session);
      if (modeSessionIdRef.current !== session.modeSessionId) {
        completionHandledRef.current = false;
      }
      setModeSessionId(session.modeSessionId);
      modeSessionIdRef.current = session.modeSessionId;
      if (session.chatHistory) {
        setChatHistory(session.chatHistory);
      }
      if (session.contentPayload) {
        setContentPayload(session.contentPayload);
      }
      if (session.readingProgress) {
        setReadingProgress(session.readingProgress);
      }
      setIsCompleted(session.isCompleted || false);
    });

    newSocket.on('content_payload', (payload: { contentPayload: any }) => {
      setContentPayload(payload.contentPayload);
    });

    newSocket.on('chat_history', (payload: { modeSessionId: string, chatHistory: HistoryItem[] }) => {
      setChatHistory(payload.chatHistory);
    });

    newSocket.on('ai_response', () => {
      setIsTyping(true);
    });

    newSocket.on('streaming_complete', (payload: { ai_response: string, feedback: string, ai_cefr_level: string, isCompleted: boolean, ttsAudioUrl?: string, hint?: string, readingProgress?: ReadingProgress }) => {
      setIsTyping(false);
      if (payload.readingProgress) {
        setReadingProgress(payload.readingProgress);
      }
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          role: 'assistant',
          content: payload.ai_response,
          feedback: payload.feedback,
          hint: payload.hint || null,
          assessments: null,
          audioUrl: payload.ttsAudioUrl || null,
          createdAt: new Date().toISOString(),
        }
      ]);
    });

    newSocket.on('reading_progress', (payload: ReadingProgress) => {
      setReadingProgress(payload);
    });

    newSocket.on('mcq_list', (payload: { modeSessionId: string, questions: Mcq[] }) => {
      setMcqList(payload.questions);
    });

    newSocket.on('mcq_result', (payload: { passed: boolean, correctCount: number, required: number, message: string }) => {
      if (!payload.passed) {
        toast.error(payload.message || `Need ${payload.required} correct to pass`);
      } else {
        toast.success(payload.message || 'Quiz passed!');
        setMcqList([]);
      }
    });

    newSocket.on('chat_completed', () => {
      if (completionHandledRef.current) return;
      completionHandledRef.current = true;
      setIsCompleted(true);
      void Promise.resolve(onCompletedRef.current?.()).catch(() => {
        toast.error('Your lesson finished, but progress could not be refreshed.');
      });
    });

    newSocket.on('listening_payload', (payload: any) => {
      setListeningPayload(payload);
      if (payload.mcqs && Array.isArray(payload.mcqs)) {
        setMcqList(payload.mcqs);
      }
    });

    newSocket.on('speech_transcribed', (payload: { textMessage: string, assessments: any, audioUrl?: string }) => {
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          role: 'user',
          content: payload.textMessage,
          hint: null,
          feedback: null,
          assessments: payload.assessments,
          audioUrl: payload.audioUrl || null,
          createdAt: new Date().toISOString(),
        }
      ]);
    });

    newSocket.on('session_status', (payload: { remainingSeconds: number, message?: string }) => {
      setSessionStatus({ remainingSeconds: payload.remainingSeconds, message: payload.message });
    });

    newSocket.on('content_filter_warning', (payload: any) => {
      setContentFilterWarningData({
        message: payload.message,
        violationType: payload.violationType,
        severity: payload.severity,
        violationCount: payload.violationCount,
        remainingWarnings: payload.remainingWarnings,
      });
      setIsContentFilterWarningOpen(true);
      setIsTyping(false);
    });

    newSocket.on('account_blocked', (payload: { message: string }) => {
      setIsAccountBlocked(true);
      setIsTyping(false);
      toast.error(payload.message || 'Your account has been blocked.');
      newSocket.disconnect();
      window.setTimeout(() => {
        window.location.assign('/login');
      }, 2000);
    });

    newSocket.on('error', (payload: { message: string }) => {
      toast.error(payload.message);
      setIsTyping(false);
    });

    newSocket.on('badge_unlocked', (payload: any) => {
      toast.success(`Badge Unlocked: ${payload.name}!`);
      if (onBadgeUnlockedRef.current) onBadgeUnlockedRef.current(payload);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [lessonModeId]);

  const sendMessage = useCallback((text: string) => {
    if (!socket || !modeSessionIdRef.current || isAccountBlocked) return;
    setIsTyping(true);
    setChatHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        role: 'user',
        content: text,
        hint: null,
        feedback: null,
        assessments: null,
        audioUrl: null,
        createdAt: new Date().toISOString(),
      }
    ]);
    socket.emit('text', { modeSessionId: modeSessionIdRef.current, textMessage: text });
  }, [socket, isAccountBlocked]);

  const sendAudio = useCallback((base64Audio: string, format: string = 'wav') => {
    if (!socket || !modeSessionIdRef.current || isAccountBlocked) return;
    setIsTyping(true);
    socket.emit('audio', { modeSessionId: modeSessionIdRef.current, audioBuffer: base64Audio, format });
  }, [socket, isAccountBlocked]);

  const submitMcqs = useCallback((answers: Array<number | string>) => {
    if (!socket || !modeSessionIdRef.current || isAccountBlocked) return;
    socket.emit('submit_mcqs', { modeSessionId: modeSessionIdRef.current, answers });
  }, [socket, isAccountBlocked]);

  const startListening = useCallback(() => {
    if (!socket || !modeSessionIdRef.current || isAccountBlocked) return;
    socket.emit('start_listening', { modeSessionId: modeSessionIdRef.current });
  }, [socket, isAccountBlocked]);

  const nextListeningStage = useCallback(() => {
    if (!socket || !modeSessionIdRef.current || isAccountBlocked) return;
    socket.emit('next_listening_stage', { modeSessionId: modeSessionIdRef.current });
  }, [socket, isAccountBlocked]);

  const restartSession = useCallback(() => {
    if (!socket || !lessonModeId || isAccountBlocked) return;
    setChatHistory([]);
    setMcqList([]);
    setListeningPayload(null);
    setReadingProgress(null);
    setIsCompleted(false);
    socket.emit('restart_mode_session', { lessonModeId });
  }, [socket, lessonModeId, isAccountBlocked]);

  const resetActivityTimer = useCallback(() => {
    if (!socket || !modeSessionIdRef.current) return;
    socket.emit('reset_activity_timer', { modeSessionId: modeSessionIdRef.current });
  }, [socket]);

  return {
    modeSessionId,
    chatHistory,
    contentPayload,
    mcqList,
    listeningPayload,
    readingProgress,
    isTyping,
    setIsTyping,
    isCompleted,
    sessionStatus,
    isAccountBlocked,
    isContentFilterWarningOpen,
    setIsContentFilterWarningOpen,
    contentFilterWarningData,
    resetActivityTimer,
    sendMessage,
    sendAudio,
    submitMcqs,
    startListening,
    nextListeningStage,
    restartSession
  };
}
