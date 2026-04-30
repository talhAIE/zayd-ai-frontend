import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { Howl, Howler } from "howler";
import {
  ChevronLeft,
  Clock,
  Check,
  Info,
  BookOpen,
  ArrowRight,
  Menu,
  Bell,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AudioPlayer from "@/pages/student/AudioPlayer3D";
import AvatarModeLayout from "./AvatarModeLayout";
import birdWithHeadphones from "@/assets/images/bird-with-headphones.png";

// --- Types ---
export interface McqAnswer {
  questionId: string;
  answerIndex: number;
}

export interface ListeningData {
  narrationText?: string;
  narrationAudioUrl?: string;
  narrationVideoUrl?: string;
  questionText?: string;
  questionAudioUrl?: string;
  kbAudioUrl?: string;
  introText?: string;
  mcqs?: McqItem[];
  questions?: McqItem[];
}

export interface McqItem {
  id: string;
  question: string;
  options: string[];
  correct: number;
  hint?: string;
}

export interface ListeningStageData {
  stage?: string | null;
  kbAudioUrl?: string;
}

export interface ListeningAudioState {
  isPlaying: boolean;
  progress: number;
  duration: number;
}

export interface ListeningAudioController {
  toggle: () => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
}

interface Listening3DProgressSnapshot {
  chatId: string | null;
  listeningStage: string | null;
  showListeningHints: boolean;
  showListeningCompletionCard: boolean;
  currentMcqIndex: number;
  mcqAnswers: { [key: string]: number };
  mcqList: McqItem[];
  listeningData: ListeningData | null;
}

// --- Logger ---
const logger = {
  log: (message: string, ...optionalParams: any[]) => {
    console.log(`[${new Date().toISOString()}] ${message}`, ...optionalParams);
  },
  emitting: (event: string, payload: any) => {
    console.log(
      `%c[Socket.IO EMIT] >> %c${event}`,
      "color: #f39c12; font-weight: bold;",
      "color: #f39c12;",
      { payload }
    );
  },
  receiving: (event: string, payload: any) => {
    console.log(
      `%c[Socket.IO RECEIVE] << %c${event}`,
      "color: #2ecc71; font-weight: bold;",
      "color: #2ecc71;",
      { payload }
    );
  },
  info: (message: string, data?: any) => {
    console.info(
      `%c[INFO] %c${message}`,
      "color: #3498db; font-weight: bold;",
      "color: inherit;",
      data || ""
    );
  },
  error: (message: string, error?: any) => {
    console.error(
      `%c[ERROR] %c${message}`,
      "color: #e74c3c; font-weight: bold;",
      "color: inherit;",
      error || ""
    );
  },
};

// --- Constants ---
const ChatEvents = {
  RESET_CHAT: "reset_chat",
  SESSION_STATUS: "session_status",
  ERROR: "error",
  BADGE_UNLOCKED: "badge_unlocked",
  MCQ_LIST: "mcq_list",
  SUBMIT_MCQS: "submit_mcqs",
  MCQ_RESULT: "mcq_result",
  ACCOUNT_BLOCKED: "account_blocked",
  CONTENT_FILTER_WARNING: "content_filter_warning",
} as const;

// --- Props ---
export interface ListeningMode3DProps {
  isAvatar3D?: boolean;
  avatarVideoSrc?: string;
  avatarSeed?: number;
  onStageChange?: (stage: string | null, data?: ListeningStageData) => void;
  onAudioStateChange?: (state: ListeningAudioState) => void;
  onAudioController?: (controller: ListeningAudioController) => void;
  onVideoUrlChange?: (videoUrl?: string) => void;
  onSessionTimeRemaining?: (remaining: number | null) => void;
  onChatCompleted?: () => void;
}

const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

const ListeningMode3D: React.FC<ListeningMode3DProps> = ({
  isAvatar3D = false,
  avatarVideoSrc,
  avatarSeed = 0,
  onStageChange,
  onAudioStateChange,
  onAudioController,
  onVideoUrlChange,
  onSessionTimeRemaining,
  onChatCompleted,
}) => {
  // --- State ---
  const [chatId, setChatId] = useState<string | null>(null);
  const [listeningStage, setListeningStage] = useState<string | null>("initial");
  const [listeningData, setListeningData] = useState<ListeningData | null>(null);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number }>({});
  const [mcqList, setMcqList] = useState<McqItem[]>([]);
  const [pendingMcqPayload, setPendingMcqPayload] = useState<any>(null);

  const [showListeningHints, setShowListeningHints] = useState(false);
  const [showListeningCompletionCard, setShowListeningCompletionCard] = useState(false);
  const [showReplayPopup, setShowReplayPopup] = useState(false);
  const [hasPlayedIntroAudio, setHasPlayedIntroAudio] = useState(false);
  const [isContextCompleted, setIsContextCompleted] = useState(false);
  const [isListeningStepTransitioning, setIsListeningStepTransitioning] = useState(false);
  const [, setIsListeningLoading] = useState(false);

  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [shouldShowTranscriptExpandButton, setShouldShowTranscriptExpandButton] = useState(false);

  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  const [sessionLimitReached, setSessionLimitReached] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [, setIsSocketConnected] = useState(false);
  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [, setIsAudioUnlocked] = useState(false);

  // Badge modal
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [unlockedBadgeInfo, setUnlockedBadgeInfo] = useState<{
    name: string;
    description: string;
    iconUrl: string;
    pointValue: number;
  } | null>(null);

  // Content filter / Account blocked
  const [isContentFilterWarningOpen, setIsContentFilterWarningOpen] = useState(false);
  const [contentFilterWarningData, setContentFilterWarningData] = useState<any>(null);
  const [isAccountBlockedOpen, setIsAccountBlockedOpen] = useState(false);
  const [accountBlockedData, setAccountBlockedData] = useState<any>(null);
  const [isDuplicateConnectionModalOpen, setIsDuplicateConnectionModalOpen] = useState(false);

  // --- Refs ---
  const socketRef = useRef<Socket<any, any> | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const kbAudioSeekRef = useRef(0);
  const onEndCalledRef = useRef(false);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerBaseRef = useRef<{ remainingSeconds: number; receivedAt: number } | null>(null);
  const sessionTimerLastEmittedRef = useRef<number | null>(null);
  const listeningStageRef = useRef<string | null>(null);
  const chatIdRef = useRef<string | null>(null);
  const mcqListRef = useRef<McqItem[]>([]);
  const quizPrefetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listeningLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<HTMLParagraphElement>(null);
  const clickLocked = useRef(false);
  const hasListeningStartedRef = useRef(false);
  const wantsQuizRef = useRef(false);
  const wantsHintsRef = useRef(false);
  const prefetchedQuizRef = useRef(false);
  const lastListeningStageRequestRef = useRef<number>(0);
  const skipListeningCompletionStepRef = useRef(false);

  // Callback refs to prevent effect re-triggering
  const onStageChangeRef = useRef(onStageChange);
  const onAudioStateChangeRef = useRef(onAudioStateChange);
  const onAudioControllerRef = useRef(onAudioController);
  const onVideoUrlChangeRef = useRef(onVideoUrlChange);
  const onSessionTimeRemainingRef = useRef(onSessionTimeRemaining);
  const onChatCompletedRef = useRef(onChatCompleted);

  // Update refs when callbacks change
  useEffect(() => {
    onStageChangeRef.current = onStageChange;
  }, [onStageChange]);

  useEffect(() => {
    onAudioStateChangeRef.current = onAudioStateChange;
  }, [onAudioStateChange]);

  useEffect(() => {
    onAudioControllerRef.current = onAudioController;
  }, [onAudioController]);

  useEffect(() => {
    onVideoUrlChangeRef.current = onVideoUrlChange;
  }, [onVideoUrlChange]);

  useEffect(() => {
    onSessionTimeRemainingRef.current = onSessionTimeRemaining;
  }, [onSessionTimeRemaining]);

  useEffect(() => {
    onChatCompletedRef.current = onChatCompleted;
  }, [onChatCompleted]);

  // --- Navigation & User ---
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const userData = JSON.parse(localStorage.getItem("AiTutorUser") || "{}");
  const userId = userData?.id;
  const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

  const isSessionExpired = sessionLimitReached || sessionTimeRemaining === 0;
  const progressStorageKey =
    userId && topicId ? `listening3d-progress:${userId}:${topicId}` : null;

  // Check if user is one of the unlimited session demo accounts
  const hasUnlimitedSessions = () => {
    const username = userData?.username;
    if (!username) return false;
    return /^3d-student-(0[1-9]|10)$/.test(username);
  };

  // --- Audio Unlock ---
  const unlockAudio = useCallback(() => {
    const unlock = () => {
      if (Howler.ctx && Howler.ctx.state !== "running") {
        Howler.ctx.resume().then(() => {
          logger.info("Audio context unlocked successfully by user gesture.");
          setIsAudioUnlocked(true);
          document.removeEventListener("touchstart", unlock, true);
          document.removeEventListener("touchend", unlock, true);
          document.removeEventListener("click", unlock, true);
        });
      } else {
        setIsAudioUnlocked(true);
        document.removeEventListener("touchstart", unlock, true);
        document.removeEventListener("touchend", unlock, true);
        document.removeEventListener("click", unlock, true);
      }
    };

    document.addEventListener("touchstart", unlock, true);
    document.addEventListener("touchend", unlock, true);
    document.addEventListener("click", unlock, true);

    return () => {
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("touchend", unlock, true);
      document.removeEventListener("click", unlock, true);
    };
  }, []);

  useEffect(() => {
    return unlockAudio();
  }, [unlockAudio]);

  // --- Helpers ---
  const normalizeListeningStage = (
    incomingStage: string | null | undefined,
    payload: any
  ): string | null => {
    if (incomingStage === "initial") return "initial";
    if (incomingStage === "question") return "question_text";
    if (incomingStage === "quiz") return "quiz";
    if (payload?.questionText) return "question_text";
    if ((payload?.mcqs || payload?.questions || []).length > 0) return "quiz";
    if (payload?.narrationText || payload?.narrationAudioUrl) return "initial";
    return null;
  };

  const parseListeningHintLines = (rawHint: string): string[] => {
    const normalized = rawHint
      .replace(/\r\n/g, "\n")
      .replace(/[•●▪◦]/g, "\n")
      .replace(/\s+-\s+/g, "\n")
      .replace(/\s*;\s*/g, "\n")
      .replace(/\n+/g, "\n")
      .trim();

    return normalized
      .split("\n")
      .map((part) => part.trim().replace(/^[,-]\s*/, ""))
      .filter((part) => part.length > 0);
  };

  const clearSavedProgress = useCallback(() => {
    if (!progressStorageKey) return;
    localStorage.removeItem(progressStorageKey);
  }, [progressStorageKey]);

  // --- Audio Functions ---
  const clearAudioProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setAudioProgress(0);
    setAudioDuration(0);
  };

  const handleKbAudioEnd = () => {
    setIsContextCompleted(true);
    if (listeningStage === "initial") {
      setHasPlayedIntroAudio(true);
    }
  };

  const toggleAudio = useCallback(
    (id: string, audioUrl: string | undefined, onEnd?: () => void) => {
      if (!audioUrl) return;

      if (soundRef.current && playingAudioId === id) {
        if (soundRef.current.playing()) {
          if (id === "kb-audio") {
            kbAudioSeekRef.current = Number(soundRef.current.seek() || 0);
          }
          soundRef.current.pause();
          setIsCurrentlyPlaying(false);
        } else {
          if (id === "kb-audio" && kbAudioSeekRef.current > 0) {
            soundRef.current.seek(kbAudioSeekRef.current);
          }
          soundRef.current.play();
          setIsCurrentlyPlaying(true);
          if (id === "kb-audio") {
            onEndCalledRef.current = false;
          }
        }
        return;
      }

      if (soundRef.current) {
        soundRef.current.stop();
      }

      clearAudioProgress();
      onEndCalledRef.current = false;

      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        onplay: () => {
          setPlayingAudioId(id);
          setIsCurrentlyPlaying(true);
          if (id === "kb-audio") {
            setIsContextCompleted(false);
            onEndCalledRef.current = false;
          }
          setAudioDuration(sound.duration());
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = setInterval(() => {
            const seek = sound.seek() || 0;
            setAudioProgress(seek);
            if (id === "kb-audio") {
              kbAudioSeekRef.current = Number(seek);
            }
            if (seek >= sound.duration() - 0.1 && onEnd && !onEndCalledRef.current) {
              onEndCalledRef.current = true;
              onEnd();
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current as unknown as number);
              }
              progressIntervalRef.current = null;
            }
          }, 100);
        },
        onpause: () => {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setIsCurrentlyPlaying(false);
          if (id === "kb-audio") {
            kbAudioSeekRef.current = Number(sound.seek() || 0);
            setIsContextCompleted(false);
          }
        },
        onstop: () => {
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          clearAudioProgress();
          if (id === "kb-audio") {
            kbAudioSeekRef.current = 0;
            setIsContextCompleted(false);
          }
        },
        onend: () => {
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          clearAudioProgress();
          if (id === "kb-audio") {
            kbAudioSeekRef.current = 0;
          }
          if (onEnd && !onEndCalledRef.current) {
            onEndCalledRef.current = true;
            onEnd();
          }
        },
        onload: () => {
          setAudioDuration(sound.duration());
        },
        onplayerror: (_soundId: number, _error: any) => {
          logger.error("Howler play error");
          toast.error("Could not play audio.");
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          clearAudioProgress();
        },
      });

      sound.play();
      soundRef.current = sound;
    },
    [playingAudioId]
  );

  const playKbAudio = useCallback(() => {
    if (!listeningData?.kbAudioUrl) return;
    if (soundRef.current) {
      if (playingAudioId !== "kb-audio") {
        setPlayingAudioId("kb-audio");
      }
      if (kbAudioSeekRef.current > 0) {
        soundRef.current.seek(kbAudioSeekRef.current);
      }
      soundRef.current.play();
      setIsCurrentlyPlaying(true);
      return;
    }
    toggleAudio("kb-audio", listeningData.kbAudioUrl, handleKbAudioEnd);
  }, [listeningData?.kbAudioUrl, playingAudioId, toggleAudio]);

  const pauseKbAudio = useCallback(() => {
    if (soundRef.current) {
      kbAudioSeekRef.current = Number(soundRef.current.seek() || 0);
      soundRef.current.pause();
      setIsCurrentlyPlaying(false);
    }
  }, []);

  const restartKbAudio = useCallback(() => {
    if (!listeningData?.kbAudioUrl) return;
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    kbAudioSeekRef.current = 0;
    setPlayingAudioId(null);
    setIsCurrentlyPlaying(false);
    clearAudioProgress();
    onEndCalledRef.current = false;
    toggleAudio("kb-audio", listeningData.kbAudioUrl, handleKbAudioEnd);
  }, [listeningData?.kbAudioUrl, toggleAudio]);

  // --- Socket Functions ---
  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(
      () => {
        logger.info("User inactive, disconnecting socket.");
        socketRef.current?.disconnect();
        setIsInactiveDialogOpen(true);
      },
      5 * 60 * 1000
    );
  }, []);

  const requestNextListeningStage = useCallback(
    (delayMs = 0) => {
      if (!socketRef.current || !chatIdRef.current) return;
      if (quizPrefetchTimerRef.current) {
        clearTimeout(quizPrefetchTimerRef.current);
      }
      const emitNextStage = () => {
        lastListeningStageRequestRef.current = Date.now();
        socketRef.current?.emit("next_listening_stage", { chatId: chatIdRef.current });
      };
      if (delayMs > 0) {
        quizPrefetchTimerRef.current = setTimeout(emitNextStage, delayMs);
        return;
      }
      emitNextStage();
    },
    []
  );

  const openListeningQuiz = useCallback(
    (payload: any) => {
      const quizItems = payload?.mcqs || payload?.questions || [];
      if (!quizItems.length) return;
      setListeningStage("quiz");
      setMcqList(quizItems);
      setCurrentMcqIndex(0);
      setSelectedAnswer(null);
      setPendingMcqPayload(null);
      wantsQuizRef.current = false;
      skipListeningCompletionStepRef.current = false;
      if (payload?.chatId) {
        setChatId(payload.chatId);
      }
      setListeningData((prevData: any) => ({
        ...prevData,
        ...payload,
      }));
      onStageChangeRef.current?.("quiz", { stage: "quiz", kbAudioUrl: payload?.kbAudioUrl });
    },
    []
  );

  const submitFinalAnswers = useCallback(
    (finalAnswers: { [key: string]: number }) => {
      if (!socketRef.current || !chatId) {
        toast.error("Connection issue, cannot submit final answers.");
        return;
      }

      const answers: McqAnswer[] = Object.entries(finalAnswers).map(
        ([questionId, answerIndex]) => ({
          questionId,
          answerIndex,
        })
      );

      const payload = { chatId, answers };
      logger.emitting(ChatEvents.SUBMIT_MCQS, payload);
      socketRef.current.emit(ChatEvents.SUBMIT_MCQS, payload);
    },
    [chatId]
  );

  const handleSubmitAnswer = useCallback(() => {
    resetActivityTimer();

    if (selectedAnswer === null) {
      toast.warning("Please select an answer.");
      return;
    }
    const currentQuestion = mcqList[currentMcqIndex];
    if (!currentQuestion) {
      toast.error("An error occurred. Could not find current question.");
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correct;

    if (isCorrect) {
      toast.success("Correct!", { duration: 2000 });
      const newAnswers = {
        ...mcqAnswers,
        [currentQuestion.id]: selectedAnswer,
      };
      setMcqAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentMcqIndex < mcqList.length - 1) {
        setCurrentMcqIndex(currentMcqIndex + 1);
      } else {
        submitFinalAnswers(newAnswers);
        toast.success("🎉 Listening practice completed!", {
          description: "Great job!",
          duration: 4000,
        });
        setChatCompleted(true);
        setIsCompleteDialogOpen(true);
        clearSavedProgress();
        onChatCompletedRef.current?.();
      }
    } else {
      pauseKbAudio();
      toast.error("Not quite, try again!", {
        description: "Listen to the audio again for a hint.",
        duration: 3000,
      });
      setShowReplayPopup(true);
    }
  }, [
    selectedAnswer,
    mcqList,
    currentMcqIndex,
    mcqAnswers,
    resetActivityTimer,
    pauseKbAudio,
    submitFinalAnswers,
    clearSavedProgress,
  ]);

  const handleNextStage = useCallback(() => {
    resetActivityTimer();

    const nextMcqs = pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];

    // Step 2: show hints after intro before advancing
    if (
      listeningStage === "initial" &&
      !showListeningHints &&
      !showListeningCompletionCard
    ) {
      setShowListeningHints(true);
      if (!nextMcqs?.length) {
        wantsHintsRef.current = true;
        if (!prefetchedQuizRef.current) {
          prefetchedQuizRef.current = true;
          requestNextListeningStage();
        }
      }
      return;
    }

    // Step 3: show completion card after hints before quiz
    if (
      listeningStage === "initial" &&
      showListeningHints &&
      !showListeningCompletionCard
    ) {
      setShowListeningHints(false);
      setShowListeningCompletionCard(true);
      return;
    }

    // Step 3: show completion card after transcript before quiz
    if (
      listeningStage === "question_text" &&
      !showListeningCompletionCard &&
      !skipListeningCompletionStepRef.current
    ) {
      setShowListeningCompletionCard(true);
      return;
    }

    if (skipListeningCompletionStepRef.current) {
      const currentMcqs =
        pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];
      if (currentMcqs.length > 0) {
        openListeningQuiz({ chatId, ...pendingMcqPayload });
        setPendingMcqPayload(null);
        return;
      } else {
        setListeningStage("quiz");
        wantsQuizRef.current = true;
        if (!prefetchedQuizRef.current) {
          prefetchedQuizRef.current = true;
          requestNextListeningStage();
        }
        toast.info("Loading quiz...");
        return;
      }
    }

    if (socketRef.current && userId && topicId && chatId) {
      clickLocked.current = true;
      setIsListeningLoading(true);
      logger.emitting("next_listening_stage", { chatId });
      requestNextListeningStage();
      toast.info(listeningStage === "question_text" ? "Loading quiz..." : "Loading next part...");

      if (listeningLoadingTimeoutRef.current) {
        clearTimeout(listeningLoadingTimeoutRef.current);
      }
      listeningLoadingTimeoutRef.current = setTimeout(() => {
        if (clickLocked.current) {
          clickLocked.current = false;
          setIsListeningLoading(false);
          toast.error("Request timed out. Please try again.");
          logger.error("Next listening stage request timed out after 8s");
        }
      }, 8000);
    } else {
      toast.error("Cannot proceed to next stage. Connection issue.");
    }
  }, [
    chatId,
    listeningStage,
    pendingMcqPayload,
    requestNextListeningStage,
    resetActivityTimer,
    showListeningCompletionCard,
    showListeningHints,
    topicId,
    userId,
    openListeningQuiz,
  ]);

  const handleResetChat = useCallback(() => {
    logger.info("Handling chat reset - disconnecting and reconnecting socket.");
    if (!socketRef.current) return toast.error("Socket not available.");
    clearSavedProgress();

    socketRef.current.disconnect();

    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.connect();

        socketRef.current.on("connect", () => {
          if (!topicId) return;
          const payload = { userId, topicId };
          logger.emitting(ChatEvents.RESET_CHAT, payload);
          socketRef.current?.emit(ChatEvents.RESET_CHAT, payload);

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
    }, 500);
  }, [topicId, userId, clearSavedProgress]);

  const handleStillThere = useCallback((isContinuing: boolean) => {
    setIsInactiveDialogOpen(false);
    if (isContinuing) {
      socketRef.current?.connect();
    } else {
      navigate(-1);
    }
  }, [navigate]);

  const handleContentFilterWarningAcknowledge = useCallback(() => {
    setIsContentFilterWarningOpen(false);
    socketRef.current?.connect();
  }, []);

  const handleLogout = useCallback(() => {
    clearSavedProgress();
    localStorage.removeItem("AiTutorUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.location.href = "/login";
  }, [clearSavedProgress]);

  // --- Socket Initialization ---
  useEffect(() => {
    if (!userId || !topicId) return;

    logger.info("Initializing Listening Mode Socket.IO connection...");
    const accessToken = localStorage.getItem("accessToken");
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      auth: {
        token: accessToken,
        userId: userId,
      },
      extraHeaders: { "ngrok-skip-browser-warning": "true" },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      logger.info(`Socket connected with ID: ${socket.id}`);
      setIsSocketConnected(true);
      toast.success("Connection established.");

      logger.emitting("start_listening", { userId, topicId });
      socket.emit("start_listening", { userId, topicId });

      const sessionPayload = { userId };
      logger.emitting(ChatEvents.SESSION_STATUS, sessionPayload);
      socket.emit(ChatEvents.SESSION_STATUS, sessionPayload);

      resetActivityTimer();
    });

    socket.on("listening_payload", ({ chatId: newChatId, ...data }) => {
      clickLocked.current = false;
      if (listeningLoadingTimeoutRef.current) {
        clearTimeout(listeningLoadingTimeoutRef.current);
        listeningLoadingTimeoutRef.current = null;
      }
      setIsListeningLoading(false);

      setChatId(newChatId);
      setListeningData(data);

      if (data?.narrationVideoUrl) {
        onVideoUrlChangeRef.current?.(data.narrationVideoUrl);
      } else {
        onVideoUrlChangeRef.current?.(undefined);
      }

      const payloadMcqs = data.mcqs || data.questions || [];
      const backendStage = normalizeListeningStage(data?.stage, data);

      // If we already have cached quiz data loaded from localStorage, skip socket processing
      if (listeningStageRef.current === "quiz" && mcqListRef.current.length > 0) {
        logger.info("Quiz already loaded from cache, skipping socket payload");
        return;
      }

      // Check if this is a new session (different chatId from saved progress)
      const savedStateRaw = progressStorageKey ? localStorage.getItem(progressStorageKey) : null;
      let isNewSession = false;
      if (savedStateRaw) {
        try {
          const savedState = JSON.parse(savedStateRaw);
          if (savedState.chatId && savedState.chatId !== newChatId) {
            // New session started, clear old progress
            isNewSession = true;
            clearSavedProgress();
            // Reset all refs for fresh start
            listeningStageRef.current = null;
            mcqListRef.current = [];
            prefetchedQuizRef.current = false;
            wantsQuizRef.current = false;
            wantsHintsRef.current = false;
            skipListeningCompletionStepRef.current = false;
          }
        } catch {
          clearSavedProgress();
        }
      }

      const inQuiz = listeningStageRef.current === "quiz" && mcqListRef.current.length > 0;

      if (inQuiz && backendStage !== "quiz") {
        return;
      }

      let currentStage: string | null = null;

      if (backendStage === "initial") {
        setHasPlayedIntroAudio(false);
        setIsContextCompleted(false);
        setShowListeningHints(false);
        setShowListeningCompletionCard(false);
        setPendingMcqPayload(null);
        prefetchedQuizRef.current = false;
        currentStage = "initial";
        hasListeningStartedRef.current = true;
        if (data.mcqs || data.questions) {
          setPendingMcqPayload({ chatId: newChatId, ...data });
        }
      } else if (backendStage === "question_text") {
        if (listeningStageRef.current === "initial") {
          if (wantsQuizRef.current || skipListeningCompletionStepRef.current) {
            if (!prefetchedQuizRef.current) {
              prefetchedQuizRef.current = true;
              requestNextListeningStage();
            }
            return;
          }
          if (!prefetchedQuizRef.current) {
            prefetchedQuizRef.current = true;
            requestNextListeningStage();
          }
          currentStage = "initial";
        } else {
          currentStage = "question_text";
        }
      } else if (backendStage === "quiz" && payloadMcqs.length) {
        setPendingMcqPayload({ chatId: newChatId, ...data });
        if (inQuiz) return;
        if (wantsQuizRef.current) {
          openListeningQuiz({ chatId: newChatId, ...data });
          return;
        }
        if (wantsHintsRef.current) {
          setShowListeningHints(true);
          wantsHintsRef.current = false;
        }
        currentStage = listeningStageRef.current ?? "question_text";
      }

      setListeningStage(currentStage);
      logger.info(`Listening mode stage inferred: ${currentStage}`, data);
      onStageChangeRef.current?.(currentStage, { stage: currentStage, kbAudioUrl: data.kbAudioUrl });
    });

    socket.on(ChatEvents.MCQ_LIST, (payload: any) => {
      logger.receiving(ChatEvents.MCQ_LIST, payload);
      const quizItems = payload?.mcqs || payload?.questions || [];
      if (!quizItems.length) return;
      openListeningQuiz({
        chatId: payload?.chatId ?? chatIdRef.current,
        ...payload,
      });
    });

    socket.on("listening_completed", () => {
      setChatCompleted(true);
      setIsCompleteDialogOpen(true);
      clearSavedProgress();
      toast.success("🎉 Listening session completed!");
      onChatCompletedRef.current?.();
    });

    socket.on("disconnect", (reason: any) => {
      logger.error(`Socket disconnected. Reason: ${reason}`);
      setIsSocketConnected(false);
      clickLocked.current = false;
      setIsListeningLoading(false);

      if (reason === "ping timeout" || reason === "transport close") {
        if (!isInactiveDialogOpen) {
          toast.warning("Connection lost. Trying to reconnect...");
        }
      } else if (reason === "io server disconnect") {
        toast.error("You have been disconnected by the server.");
      }
    });

    socket.on("connect_error", (err: any) => {
      logger.error("Socket connection error:", err);
      clickLocked.current = false;
      setIsListeningLoading(false);

      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.removeItem("AiTutorUser");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        return;
      }

      toast.error(`Connection failed: ${err.message}`);
    });

    socket.on("auth_error", (error: any) => {
      logger.error("WebSocket authentication error:", error);
      clickLocked.current = false;
      setIsListeningLoading(false);
      toast.error("Authentication failed. Please log in again.");
      localStorage.removeItem("AiTutorUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    });

    socket.on("session_status", (payload: any) => {
      logger.receiving("session_status", payload);

      if (hasUnlimitedSessions()) {
        sessionTimerBaseRef.current = null;
        sessionTimerLastEmittedRef.current = null;
        setSessionLimitReached(false);
        setSessionTimeRemaining(null);
        onSessionTimeRemaining?.(null);
        return;
      }

      const rawRemaining = payload?.remainingSeconds;
      if (typeof rawRemaining !== "number" || Number.isNaN(rawRemaining)) {
        sessionTimerBaseRef.current = null;
        sessionTimerLastEmittedRef.current = null;
        setSessionLimitReached(false);
        setSessionTimeRemaining(null);
        onSessionTimeRemaining?.(null);
        return;
      }
      const normalizedRemaining = Math.max(0, Math.floor(rawRemaining));
      sessionTimerBaseRef.current = {
        remainingSeconds: normalizedRemaining,
        receivedAt: Date.now(),
      };
      sessionTimerLastEmittedRef.current = normalizedRemaining;
      setSessionLimitReached(normalizedRemaining === 0);
      setSessionTimeRemaining(normalizedRemaining);
      onSessionTimeRemainingRef.current?.(normalizedRemaining);
    });

    socket.on(ChatEvents.BADGE_UNLOCKED, (payload: any) => {
      logger.receiving(ChatEvents.BADGE_UNLOCKED, payload);
      setUnlockedBadgeInfo({
        name: payload.name,
        description: payload.description,
        iconUrl: payload.iconUrl,
        pointValue: payload.pointValue,
      });
      setIsBadgeModalOpen(true);
      toast.success(`🎉 New Badge Unlocked: ${payload.name}!`);
    });

    socket.on(ChatEvents.ACCOUNT_BLOCKED, (payload: any) => {
      logger.receiving(ChatEvents.ACCOUNT_BLOCKED, payload);
      setAccountBlockedData({
        message: payload.message,
        violationCount: payload.violationCount,
        accountStatus: payload.accountStatus,
      });
      setIsAccountBlockedOpen(true);
    });

    socket.on(ChatEvents.CONTENT_FILTER_WARNING, (payload: any) => {
      logger.receiving(ChatEvents.CONTENT_FILTER_WARNING, payload);
      socketRef.current?.disconnect();
      setContentFilterWarningData({
        message: payload.message,
        violationType: payload.violationType,
        severity: payload.severity,
        violationCount: payload.violationCount,
        remainingWarnings: payload.remainingWarnings,
      });
      setIsContentFilterWarningOpen(true);
    });

    socket.on(ChatEvents.ERROR, (payload: any) => {
      logger.receiving(ChatEvents.ERROR, payload);
      clickLocked.current = false;
      setIsListeningLoading(false);

      const errorMessage = (payload.message || "").toLowerCase();
      const errorCode = payload.code;

      if (
        errorCode === "DUPLICATE_CONNECTION" ||
        errorMessage.includes("already connected from another session")
      ) {
        setIsDuplicateConnectionModalOpen(true);
      } else if (errorMessage.includes("daily session limit")) {
        if (hasUnlimitedSessions()) return;
        setSessionLimitReached(true);
        toast.error("You have reached your daily session limit.");
      } else if (errorMessage.includes("user not found")) {
        toast.error("User authentication failed. Please log in again.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error("An internal server error occurred. Please try again later.");
        logger.error("Unhandled Internal Server Error:", payload.error || payload);
      }
    });

    return () => {
      logger.info("ListeningMode3D unmounting. Disconnecting socket.");
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      if (listeningLoadingTimeoutRef.current) {
        clearTimeout(listeningLoadingTimeoutRef.current);
      }
      socket.disconnect();
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [
    userId,
    topicId,
    navigate,
    resetActivityTimer,
    requestNextListeningStage,
    openListeningQuiz,
    clearSavedProgress,
  ]);

  // --- Effects ---
  useEffect(() => {
    listeningStageRef.current = listeningStage;
  }, [listeningStage]);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    mcqListRef.current = mcqList;
  }, [mcqList]);

  useEffect(() => {
    if (!progressStorageKey) return;

    setListeningStage("initial");
    setShowListeningHints(false);
    setShowListeningCompletionCard(false);
    setCurrentMcqIndex(0);
    setSelectedAnswer(null);
    setMcqAnswers({});
    setMcqList([]);
    setPendingMcqPayload(null);

    const savedStateRaw = localStorage.getItem(progressStorageKey);
    if (!savedStateRaw) return;

    try {
      const savedState = JSON.parse(savedStateRaw) as Listening3DProgressSnapshot;
      const restoredMcqList = savedState.mcqList ?? [];
      const restoredStage =
        savedState.listeningStage === "quiz" && restoredMcqList.length === 0
          ? "initial"
          : savedState.listeningStage ?? "initial";

      setChatId(savedState.chatId ?? null);
      setListeningStage(restoredStage);
      setShowListeningHints(Boolean(savedState.showListeningHints));
      setShowListeningCompletionCard(Boolean(savedState.showListeningCompletionCard));
      setCurrentMcqIndex(Math.max(0, savedState.currentMcqIndex ?? 0));
      setMcqAnswers(savedState.mcqAnswers ?? {});
      setMcqList(restoredMcqList);
      setListeningData(savedState.listeningData ?? null);

      // Sync refs immediately so socket handlers see correct state
      listeningStageRef.current = restoredStage;
      chatIdRef.current = savedState.chatId ?? null;
      mcqListRef.current = restoredMcqList;
      hasListeningStartedRef.current = true;

      if (restoredStage === "quiz" && restoredMcqList.length > 0) {
        // Already have quiz data, mark as prefetched
        prefetchedQuizRef.current = true;
        wantsQuizRef.current = false;
      }

      if (restoredMcqList.length > 0) {
        setPendingMcqPayload({
          chatId: savedState.chatId,
          mcqs: restoredMcqList,
          questions: restoredMcqList,
        });
      }
    } catch (error) {
      logger.error("Failed to restore listening progress snapshot", error);
      clearSavedProgress();
    }
  }, [progressStorageKey, clearSavedProgress]);

  useEffect(() => {
    if (!progressStorageKey || chatCompleted) return;

    const snapshot: Listening3DProgressSnapshot = {
      chatId,
      listeningStage,
      showListeningHints,
      showListeningCompletionCard,
      currentMcqIndex,
      mcqAnswers,
      mcqList,
      listeningData,
    };

    localStorage.setItem(progressStorageKey, JSON.stringify(snapshot));
  }, [
    progressStorageKey,
    chatCompleted,
    chatId,
    listeningStage,
    showListeningHints,
    showListeningCompletionCard,
    currentMcqIndex,
    mcqAnswers,
    mcqList,
    listeningData,
  ]);

  useEffect(() => {
    if (listeningStage === "question_text") {
      setIsContextCompleted(false);
      setHasPlayedIntroAudio(false);
      setShowListeningCompletionCard(false);
      setShowListeningHints(false);
    }
  }, [listeningStage]);

  useEffect(() => {
    setIsListeningStepTransitioning(true);
    const t = setTimeout(() => {
      setIsListeningStepTransitioning(false);
    }, 20);
    return () => clearTimeout(t);
  }, [listeningStage, showListeningHints, showListeningCompletionCard]);

  // Session timer countdown
  useEffect(() => {
    const tick = () => {
      const base = sessionTimerBaseRef.current;
      if (!base) return;
      const elapsedSeconds = Math.floor((Date.now() - base.receivedAt) / 1000);
      const nextRemaining = Math.max(0, base.remainingSeconds - elapsedSeconds);
      if (sessionTimerLastEmittedRef.current !== nextRemaining) {
        sessionTimerLastEmittedRef.current = nextRemaining;
        setSessionLimitReached(nextRemaining === 0);
        setSessionTimeRemaining(nextRemaining);
        onSessionTimeRemainingRef.current?.(nextRemaining);
      }
    };

    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Audio controller registration
  useEffect(() => {
    onAudioControllerRef.current?.({
      toggle: () => toggleAudio("kb-audio", listeningData?.kbAudioUrl, handleKbAudioEnd),
      play: playKbAudio,
      pause: pauseKbAudio,
      restart: restartKbAudio,
    });
  }, [listeningData?.kbAudioUrl, toggleAudio, playKbAudio, pauseKbAudio, restartKbAudio]);

  // Audio state updates
  useEffect(() => {
    onAudioStateChangeRef.current?.({
      isPlaying: playingAudioId === "kb-audio" && isCurrentlyPlaying,
      progress: playingAudioId === "kb-audio" ? audioProgress : 0,
      duration: playingAudioId === "kb-audio" ? audioDuration : 0,
    });
  }, [playingAudioId, isCurrentlyPlaying, audioProgress, audioDuration]);

  // Transcript expand button check
  useEffect(() => {
    if (!transcriptRef.current) return;
    setIsTranscriptExpanded(false);

    const element = transcriptRef.current;
    const originalClass = element.className;
    element.className = originalClass.replace("line-clamp-5", "line-clamp-none");
    const fullHeight = element.scrollHeight;
    element.className = originalClass;

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 24;
    const maxHeight = lineHeight * 5;
    setShouldShowTranscriptExpandButton(fullHeight > maxHeight);
  }, [listeningData?.questionText]);

  // --- Computed Values ---
  const shouldShowListeningIntro =
    listeningStage === "initial" && !showListeningHints && !showListeningCompletionCard;

  const shouldShowListeningHint = showListeningHints && !showListeningCompletionCard;

  const pendingMcqs = pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];

  const listeningHints = [
    ...(pendingMcqs || []),
    ...(mcqList || []),
  ]
    .flatMap((mcq: any) =>
      typeof mcq?.hint === "string" ? parseListeningHintLines(mcq.hint) : []
    )
    .filter((hint: string) => hint.length > 0);

  const listeningHintText =
    listeningHints.length > 0
      ? listeningHints
      : listeningData?.questionText
      ? [listeningData.questionText]
      : [];

  // --- Render ---
  return (
    <>
      {/* Replay Popup */}
      <Dialog
        open={showReplayPopup}
        onOpenChange={(open) => {
          if (!open) setShowReplayPopup(false);
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>That&apos;s not quite right</DialogTitle>
            <DialogDescription>
              Would you like to listen to the audio again for a hint before you try
              again?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button 
            className="bg-[#5EA9FF] hover:bg-[#4E98F0] text-white"
            onClick={() => setShowReplayPopup(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Completion Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={(open) => !open && navigate(-1)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Practice Complete</DialogTitle>
            <DialogDescription>
              Great job! You&apos;ve successfully completed the listening exercise.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              End Session
            </Button>
            <Button
            className="bg-[#5EA9FF] hover:bg-[#4E98F0] text-white"
            onClick={handleResetChat}>Reset Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MCQ Quiz */}
      {listeningStage === "quiz" && mcqList.length > 0 && (
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
              {mcqList[currentMcqIndex].question}
            </p>
            <div className="flex flex-col gap-2">
              {mcqList[currentMcqIndex].options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAnswer(index);
                    resetActivityTimer();
                  }}
                  className={`w-full justify-start p-4 h-auto transition-colors rounded-2xl ${
                    selectedAnswer === index
                      ? "bg-[#3EA4F9] text-white hover:bg-[#2F93F0] border-transparent"
                      : "bg-white border-[#E1E7F0] text-[#2B3A67]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 mr-4 rounded-full border flex-shrink-0 ${
                      selectedAnswer === index ? "bg-white border-white" : "border-[#C9D6E6]"
                    }`}
                  />
                  <span>{option}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {listeningStage !== "quiz" && (
        <div
          className={`flex flex-col max-w-[800px] mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-2xl h-[calc(100svh-9.5rem)] max-h-[calc(100svh-9.5rem)]`}
        >
          {/* Header */}
          <header className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 md:px-6 py-4 border-b bg-white">
            <div className="flex items-center gap-2 justify-self-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hidden md:inline-flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="min-w-0 truncate text-center text-base md:text-lg font-semibold">
              Listening Mode
            </h2>
            <div className="flex items-center gap-2 justify-self-end">
              <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
                <Clock className="h-5 w-5 text-[#3EA4F9]" />
                <span>
                  {sessionTimeRemaining !== null ? formatTime(sessionTimeRemaining) : "..."}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Session Expired Banner */}
          {isSessionExpired && (
            <div className="bg-yellow-500 text-white text-center p-2 text-sm font-semibold">
              You have reached your session limit.
            </div>
          )}

          {/* Chat Completed Banner */}
          {chatCompleted && !isCompleteDialogOpen && (
            <div className="bg-primary/80 backdrop-blur-sm text-white text-center p-2 text-sm font-semibold">
              This conversation has ended.
            </div>
          )}

          {/* Main Listening Content */}
          <div
            className={`relative flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 transition-all duration-500 ease-out ${
              isListeningStepTransitioning ? "opacity-0 translate-x-6" : "opacity-100 translate-x-0"
            }`}
          >
            {/* Mobile Timer */}
            <div className="md:hidden flex justify-start">
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
                <Clock className="h-5 w-5 text-[#3EA4F9]" />
                <span>
                  {sessionTimeRemaining !== null ? formatTime(sessionTimeRemaining) : "..."}
                </span>
              </div>
            </div>

            {/* Avatar + Audio Player */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 md:p-6">
              <div className="relative rounded-2xl bg-[#F8FAFC] border border-slate-200 overflow-hidden p-4 md:p-6">
                {isAvatar3D && (
                  <AvatarModeLayout
                    key={`listening-avatar-${avatarSeed}`}
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
                    toggleAudio("kb-audio", listeningData?.kbAudioUrl, handleKbAudioEnd)
                  }
                />
              </div>
            </div>

            {/* Listening Intro */}
            {shouldShowListeningIntro && (
              <div className="rounded-2xl bg-white border border-[#B9E1FF] p-4 md:p-5 shadow-sm">
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

            {/* Hints */}
            {shouldShowListeningHint && (
              <div className="rounded-2xl bg-[#CFE9FF] border border-[#8CC7FF] p-4 md:p-5 shadow-sm text-left">
                <div className="flex items-center gap-2 text-[#2B6CB0] font-semibold mb-2">
                  <Info className="h-4 w-4" />
                  Hints
                </div>
                {listeningHintText.length > 0 ? (
                  <ul className="text-sm text-[#2F4B66] space-y-2 list-disc pl-5">
                    {listeningHintText.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#2F4B66]">
                    Hints will appear here as you progress.
                  </p>
                )}
              </div>
            )}

            {/* Transcript */}
            {listeningStage === "question_text" && !showListeningCompletionCard && (
              <div className="rounded-2xl bg-white border border-[#B9E1FF] p-4 md:p-5 shadow-sm">
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
                  {listeningData?.questionText || "Transcript will appear here as you progress."}
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

            {/* Completion Card */}
            {showListeningCompletionCard && (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-3 md:px-6">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
                <div className="relative w-full max-w-[720px] mx-auto text-center px-4 md:px-8 py-6 bg-white border border-slate-200 rounded-2xl shadow-xl">
                  <img
                    src={birdWithHeadphones}
                    alt="Listening helper"
                    className="h-28 w-auto mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-[#2B3A67]">Done with it?</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Ready for the quiz? You can continue or replay the avatar explanation.
                  </p>
                  <Button
                    className="w-full mt-5 rounded-full bg-[#5EA9FF] hover:bg-[#4E98F0] text-white"
                    onClick={() => {
                      setShowListeningCompletionCard(false);
                      setShowListeningHints(false);
                      skipListeningCompletionStepRef.current = true;
                      wantsQuizRef.current = true;
                      wantsHintsRef.current = false;
                      prefetchedQuizRef.current = false;
                      handleNextStage();
                    }}
                  >
                    Continue to Quiz
                  </Button>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      className="w-full rounded-full text-gray-500 hover:bg-gray-100 h-10 px-3 md:px-4 text-[11px] sm:text-sm leading-none whitespace-nowrap min-w-0 justify-center gap-2"
                      onClick={() => {
                        setShowListeningCompletionCard(false);
                        setShowListeningHints(false);
                        skipListeningCompletionStepRef.current = false;
                        setListeningStage("initial");
                        setShowListeningHints(true);
                        restartKbAudio();
                      }}
                      disabled={!listeningData?.kbAudioUrl}
                    >
                      Replay Avatar Video
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {!showListeningCompletionCard && (
        <div className="w-full max-w-[800px] mx-auto">
          <Button
            className="w-full mt-4 rounded-full p-5 bg-[#5EA9FF] hover:bg-[#4E98F0] text-white flex items-center justify-center gap-2"
            onClick={() => {
              if (clickLocked.current) return;
              clickLocked.current = true;
              setTimeout(() => (clickLocked.current = false), 2000);

              if (listeningStage === "question_text" && !showListeningCompletionCard) {
                setShowListeningCompletionCard(true);
                return;
              }

              listeningStage === "quiz" ? handleSubmitAnswer() : handleNextStage();
            }}
            disabled={
              (listeningStage === "initial" && !hasPlayedIntroAudio) ||
              (listeningStage === "question_text" && !isContextCompleted) ||
              (listeningStage === "quiz" && selectedAnswer === null)
            }
          >
            <span>{listeningStage === "quiz" ? "Submit Answer" : "Next"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Reset Confirm Dialog */}
      <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Chat Session?</DialogTitle>
            <DialogDescription>
              This will clear all current messages and restart the chat from the beginning. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsResetConfirmOpen(false);
                handleResetChat();
              }}
            >
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inactivity Dialog */}
      <Dialog
        open={isInactiveDialogOpen}
        onOpenChange={(open) => !open && handleStillThere(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you still there?</DialogTitle>
            <DialogDescription>
              Your session was paused due to inactivity. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleStillThere(false)}>
              No, End Session
            </Button>
            <Button onClick={() => handleStillThere(true)}>Yes, I&apos;m Here</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Badge Modal */}
      <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              🎉 Badge Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Congratulations! You&apos;ve earned a new badge for your progress.
            </DialogDescription>
          </DialogHeader>
          {unlockedBadgeInfo && (
            <div className="flex flex-col items-center justify-center p-4 my-4 bg-gray-50 rounded-lg">
              <img
                src={unlockedBadgeInfo.iconUrl}
                alt={unlockedBadgeInfo.name}
                className="w-24 h-24 mb-4 drop-shadow-lg"
              />
              <h3 className="text-xl font-semibold text-primary">{unlockedBadgeInfo.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{unlockedBadgeInfo.description}</p>
              <p className="text-lg font-bold text-yellow-600 mt-4">
                +{unlockedBadgeInfo.pointValue} Points
              </p>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setIsBadgeModalOpen(false)} className="w-full">
              Claim & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Connection Modal */}
      <Dialog
        open={isDuplicateConnectionModalOpen}
        onOpenChange={setIsDuplicateConnectionModalOpen}
      >
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Duplicate Session Detected
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              You are already connected from another session. Please logout from other sessions and
              try again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 my-4 bg-red-50 rounded-lg border border-red-200">
            <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Connection Blocked</h3>
            <p className="text-sm text-red-600 text-center">
              Only one active session is allowed per account. Please close other browser tabs or
              devices where you&apos;re logged in.
            </p>
          </div>
          <DialogFooter className="sm:justify-center space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDuplicateConnectionModalOpen(false);
                navigate("/login");
              }}
              className="w-full"
            >
              Go to Login
            </Button>
            <Button
              onClick={() => {
                setIsDuplicateConnectionModalOpen(false);
                window.location.reload();
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Filter Warning */}
      <Dialog
        open={isContentFilterWarningOpen}
        onOpenChange={(open) => {
          if (!open) return;
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              ⚠️ Content Policy Warning
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your message has been flagged for policy violation.
            </DialogDescription>
          </DialogHeader>
          {contentFilterWarningData && (
            <div className="flex flex-col gap-4 p-4 my-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">{contentFilterWarningData.message}</p>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Violation Type</p>
                    <p className="text-sm font-semibold text-orange-700">
                      {contentFilterWarningData.violationType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Severity</p>
                    <p
                      className={`text-sm font-semibold ${
                        contentFilterWarningData.severity === "High"
                          ? "text-red-600"
                          : contentFilterWarningData.severity === "Medium"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {contentFilterWarningData.severity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleContentFilterWarningAcknowledge} className="w-full">
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Blocked */}
      <Dialog open={isAccountBlockedOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-600">
              🚫 Account Blocked
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your account has been suspended due to policy violations.
            </DialogDescription>
          </DialogHeader>
          {accountBlockedData && (
            <div className="flex flex-col gap-4 p-4 my-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-gray-800">{accountBlockedData.message}</p>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-red-200">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Violations</p>
                  <p className="text-sm font-semibold text-red-700">
                    {accountBlockedData.violationCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Account Status</p>
                  <p className="text-sm font-semibold text-red-700 uppercase">
                    {accountBlockedData.accountStatus}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListeningMode3D;