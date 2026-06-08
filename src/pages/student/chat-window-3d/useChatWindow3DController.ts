import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Socket } from "socket.io-client";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useChatWindow3DAudio } from "./ChatWindow3DAudio";
import { useChatWindow3DSocket } from "./ChatWindow3DSocket";
import {
  ChatEvents,
  logger,
  parseListeningHintLines,
} from "./chat3d.shared";
import type {
  ChatWindowProps,
  ClientToServerEvents,
  McqAnswer,
  Message,
  ServerToClientEvents,
} from "./chat3d.shared";

export function useChatWindow3DController({
  onShowFeedback,
  onTopicImage,
  onContentPayload,
  onAudioPlaybackChange,
  onNarrationComplete,
  readingHeroActive = false,
  isAvatar3D = false,
  avatarVideoSrc,
  onListeningVideoUrl,
  onContentAudioComplete,
  chatLocked = false,
  onSessionTimeRemaining,
  onListeningStageChange,
  onListeningAudioState,
  onListeningAudioController,
  listeningAvatarSeed = 0,
  onUserAction,
}: ChatWindowProps) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<
    number | null
  >(null);
  const sessionTimerBaseRef = useRef<{
    remainingSeconds: number;
    receivedAt: number;
  } | null>(null);
  const sessionTimerLastEmittedRef = useRef<number | null>(null);
  const [_sessionLimitReached, _setSessionLimitReached] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const isSessionExpired = _sessionLimitReached || sessionTimeRemaining === 0;
  const emitSessionRemaining = useCallback(
    (next: number | null) => {
      setSessionTimeRemaining(next);
      onSessionTimeRemaining?.(next);
    },
    [onSessionTimeRemaining],
  );

  useEffect(() => {
    const tick = () => {
      const base = sessionTimerBaseRef.current;
      if (!base) return;
      const elapsedSeconds = Math.floor((Date.now() - base.receivedAt) / 1000);
      const nextRemaining = Math.max(0, base.remainingSeconds - elapsedSeconds);
      if (sessionTimerLastEmittedRef.current !== nextRemaining) {
        sessionTimerLastEmittedRef.current = nextRemaining;
        _setSessionLimitReached(nextRemaining === 0);
        emitSessionRemaining(nextRemaining);
      }
    };

    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [emitSessionRemaining]);

  useEffect(() => {
    if (isSessionExpired) {
      _setSessionLimitReached(true);
      return;
    }

    if (sessionTimeRemaining !== null && sessionTimeRemaining > 0) {
      _setSessionLimitReached(false);
    }
  }, [isSessionExpired, sessionTimeRemaining]);

  const [topicImage, setTopicImage] = useState<string | null>(null);
  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isQueationnaireOpen, setIsQuestionnaireOpen] = React.useState(false);
  const [mcqList, setMcqList] = useState<any[]>([]);
  const [contentPayload, setContentPayload] = useState<{
    content: string;
    audioUrl?: string;
    narrationVideoUrl?: string;
  } | null>(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [
    shouldShowTranscriptExpandButton,
    setShouldShowTranscriptExpandButton,
  ] = useState(false);
  const transcriptRef = useRef<HTMLParagraphElement>(null);

  const [unlockedBadgeInfo, setUnlockedBadgeInfo] = useState<{
    name: string;
    description: string;
    iconUrl: string;
    pointValue: number;
  } | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isDuplicateConnectionModalOpen, setIsDuplicateConnectionModalOpen] =
    useState(false);
  const [isContentFilterWarningOpen, setIsContentFilterWarningOpen] =
    useState(false);
  const [contentFilterWarningData, setContentFilterWarningData] = useState<{
    message: string;
    violationType: string;
    severity: string;
    violationCount: number;
    remainingWarnings: number;
  } | null>(null);
  const [isAccountBlockedOpen, setIsAccountBlockedOpen] = useState(false);
  const [showListeningCompletionCard, setShowListeningCompletionCard] =
    useState(false);
  const [showListeningHints, setShowListeningHints] = useState(false);
  const [hasPlayedIntroAudio, setHasPlayedIntroAudio] = useState(false);
  const [isListeningStepTransitioning, setIsListeningStepTransitioning] =
    useState(false);
  const [accountBlockedData, setAccountBlockedData] = useState<{
    message: string;
    violationCount: number;
    accountStatus: string;
  } | null>(null);

  // --- Listening Mode State ---
  const [listeningStage, setListeningStage] = useState<string | null>(null);
  const listeningStageRef = useRef<string | null>(null);
  const [listeningData, setListeningData] = useState<any>(null);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showReplayPopup, setShowReplayPopup] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number }>({});
  const [pendingMcqPayload, setPendingMcqPayload] = useState<any | null>(null);
  const onListeningAudioStateRef = useRef(onListeningAudioState);
  const onListeningAudioControllerRef = useRef(onListeningAudioController);
  const onListeningStageChangeRef = useRef(onListeningStageChange);
  const [, setIsListeningLoading] = useState(false);
  const listeningLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const [barCount, setBarCount] = useState(0);
  // --- End Listening Mode State ---

  const [isContextCompleted, setIsContextCompleted] = useState(false);
  const [, setHasStartedContextAudio] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const clickLocked = React.useRef(false);
  const skipListeningCompletionStepRef = useRef(false);
  const hasListeningStartedRef = useRef(false);
  const wantsQuizRef = useRef(false);
  const wantsHintsRef = useRef(false);
  const prefetchedQuestionRef = useRef(false);
  const prefetchedQuizRef = useRef(false);
  const lastListeningStageRequestRef = useRef<number>(0);
  const quizPrefetchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add new states for audio completion tracking
  const [_hasCompletedNarration, _setHasCompletedNarration] = useState(false);
  const [_hasCompletedQuestion, _setHasCompletedQuestion] = useState(false);
  const [_hasCompletedKbAudio, _setHasCompletedKbAudio] = useState(false);

  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { topicId } = useParams<{ topicId: string }>();
  if (!topicId) throw new Error("Topic ID is required");
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = searchParams.get("mode");
  const userData = JSON.parse(localStorage.getItem("AiTutorUser") || "{}");
  const userId = userData?.id;
  const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;
  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(
      () => {
        logger.info("User inactive, disconnecting socket.");
        socketRef.current?.disconnect();
        setIsInactiveDialogOpen(true);
      },
      5 * 60 * 1000,
    );
  }, []);

  const {
    isRecording,
    recordTime,
    playingAudioId,
    loadingAudioId,
    isCurrentlyPlaying,
    audioProgress,
    audioDuration,
    toggleAudio,
    handleKbAudioEnd,
    playKbAudio,
    pauseKbAudio,
    restartKbAudio,
    startRecording,
    stopRecording,
    unloadAudio,
  } = useChatWindow3DAudio({
    mode,
    userId,
    chatId,
    socketRef,
    onAudioPlaybackChange,
    setMessages,
    sendPlaceholder: () => sendPlaceholder(),
    setIsWaitingForResponse,
    resetActivityTimer,
    resetInactivityTimer: () => resetInactivityTimer(),
    chatCompleted,
    isSessionExpired,
    listeningData,
    listeningStage,
    setIsContextCompleted,
    setHasStartedContextAudio,
    setHasPlayedIntroAudio,
  });

  const requestNextListeningStage = (delayMs = 0) => {
    if (!socketRef.current || !chatId) return;
    if (quizPrefetchTimerRef.current) {
      clearTimeout(quizPrefetchTimerRef.current);
    }
    const emitNextStage = () => {
      lastListeningStageRequestRef.current = Date.now();
      socketRef.current?.emit("next_listening_stage", { chatId });
    };
    if (delayMs > 0) {
      quizPrefetchTimerRef.current = setTimeout(emitNextStage, delayMs);
      return;
    }
    emitNextStage();
  };

  useEffect(() => {
    if (mode !== "listening-mode") return;
    // Always start listening topics from the beginning.
    setListeningStage("initial");
    setShowListeningHints(false);
    setShowListeningCompletionCard(false);
    setPendingMcqPayload(null);
    setHasPlayedIntroAudio(false);
    setIsContextCompleted(false);
    hasListeningStartedRef.current = false;
    wantsQuizRef.current = false;
    wantsHintsRef.current = false;
    prefetchedQuestionRef.current = false;
    prefetchedQuizRef.current = false;
    lastListeningStageRequestRef.current = 0;
    if (quizPrefetchTimerRef.current) {
      clearTimeout(quizPrefetchTimerRef.current);
      quizPrefetchTimerRef.current = null;
    }
    if (listeningLoadingTimeoutRef.current) {
      clearTimeout(listeningLoadingTimeoutRef.current);
      listeningLoadingTimeoutRef.current = null;
    }
    clickLocked.current = false;
    setIsListeningLoading(false);
  }, [mode, topicId]);

  // Check if user is one of the unlimited session demo accounts (3d-student-01 to 3d-student-10)
  const hasUnlimitedSessions = () => {
    const username = userData?.username;
    if (!username) return false;
    return /^3d-student-(0[1-9]|10)$/.test(username);
  };

  // Check if content needs expansion button
  useEffect(() => {
    if (contentPayload && contentRef.current) {
      // Reset expansion state when content changes
      setIsContentExpanded(false);

      // Temporarily remove line-clamp to measure full height
      const element = contentRef.current;
      const originalClass = element.className;
      element.className = originalClass.replace(
        "line-clamp-3",
        "line-clamp-none",
      );

      const fullHeight = element.scrollHeight;

      // Restore original class
      element.className = originalClass;

      // Calculate height of 3 lines (approximate)
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 24;
      const maxHeight = lineHeight * 3;

      setShouldShowExpandButton(fullHeight > maxHeight);
    }
  }, [contentPayload]);

  useEffect(() => {
    if (mode !== "listening-mode" || !transcriptRef.current) return;
    setIsTranscriptExpanded(false);

    const element = transcriptRef.current;
    const originalClass = element.className;
    element.className = originalClass.replace(
      "line-clamp-5",
      "line-clamp-none",
    );
    const fullHeight = element.scrollHeight;
    element.className = originalClass;

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 24;
    const maxHeight = lineHeight * 5;
    setShouldShowTranscriptExpandButton(fullHeight > maxHeight);
  }, [mode, listeningData?.questionText]);

  useEffect(() => {
    if (
      mode === "reading-mode" &&
      contentPayload &&
      !contentPayload.audioUrl &&
      !isAvatar3D
    ) {
      onNarrationComplete?.();
    }
  }, [mode, contentPayload, onNarrationComplete, isAvatar3D]);

  useEffect(() => {
    if (mode !== "reading-mode" || !isAvatar3D) return;
    if (!contentPayload?.audioUrl) {
      onContentAudioComplete?.(true);
      return;
    }
    onContentAudioComplete?.(false);
  }, [mode, isAvatar3D, contentPayload?.audioUrl, onContentAudioComplete]);

  const isAvatar3DContext =
    isAvatar3D ||
    searchParams.get("variant") === "3d" ||
    location.pathname.includes("/3d-avatar-mode/");

  useEffect(() => {
    onListeningAudioStateRef.current = onListeningAudioState;
  }, [onListeningAudioState]);

  useEffect(() => {
    onListeningAudioControllerRef.current = onListeningAudioController;
  }, [onListeningAudioController]);

  useEffect(() => {
    onListeningStageChangeRef.current = onListeningStageChange;
  }, [onListeningStageChange]);

  useEffect(() => {
    listeningStageRef.current = listeningStage;
  }, [listeningStage]);

  useEffect(() => {
    if (mode !== "listening-mode" || !isAvatar3DContext) return;
    onListeningAudioStateRef.current?.({
      isPlaying: playingAudioId === "kb-audio" && isCurrentlyPlaying,
      isLoading: loadingAudioId === "kb-audio",
      progress: playingAudioId === "kb-audio" ? audioProgress : 0,
      duration: playingAudioId === "kb-audio" ? audioDuration : 0,
    });
  }, [
    mode,
    isAvatar3DContext,
    playingAudioId,
    isCurrentlyPlaying,
    audioProgress,
    audioDuration,
  ]);

  useEffect(() => {
    if (mode !== "listening-mode" || !isAvatar3DContext) return;
    onListeningAudioControllerRef.current?.({
      toggle: () =>
        toggleAudio("kb-audio", listeningData?.kbAudioUrl, () =>
          setIsContextCompleted(true),
        ),
      play: () => playKbAudio(),
      pause: () => pauseKbAudio(),
      restart: () => restartKbAudio(),
    });
  }, [mode, isAvatar3DContext, listeningData?.kbAudioUrl]);

  const openListeningQuiz = useCallback((payload: any) => {
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
    onListeningStageChangeRef.current?.("quiz", {
      kbAudioUrl: payload?.kbAudioUrl,
    });
  }, []);

  useEffect(() => {
    if (listeningStage === "question_text" && mode === "listening-mode") {
      setIsContextCompleted(false);
      setHasStartedContextAudio(false);
      setShowListeningCompletionCard(false);
      setShowListeningHints(false);
    }
  }, [listeningStage, mode]);

  useEffect(() => {
    if (mode !== "listening-mode") return;
    setIsListeningStepTransitioning(true);
    const t = setTimeout(() => {
      setIsListeningStepTransitioning(false);
    }, 20);
    return () => clearTimeout(t);
  }, [mode, listeningStage, showListeningHints, showListeningCompletionCard]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const sendPlaceholder = () => {
    logger.info("Adding AI thinking placeholder to UI.");
    setMessages((prev) => [
      ...prev,
      {
        id: `loading-${Date.now()}`,
        loading: true,
        messageType: "loading",
        type: "received",
      },
    ]);
  };
  const removeLoadingMessage = () => {
    logger.info("Removing AI thinking placeholder from UI.");
    setMessages((prev) => prev.filter((m) => !m.loading));
  };

  const submitFinalAnswers = (finalAnswers: { [key: string]: number }) => {
    if (!socketRef.current || !chatId) {
      toast.error("Connection issue, cannot submit final answers.");
      return;
    }

    const answers: McqAnswer[] = Object.entries(finalAnswers).map(
      ([questionId, answerIndex]) => ({
        questionId,
        answerIndex,
      }),
    );

    const payload = { chatId, answers };
    logger.emitting(ChatEvents.SUBMIT_MCQS, payload);
    socketRef.current.emit(ChatEvents.SUBMIT_MCQS, payload);
  };

  const handleSubmitAnswer = () => {
    // Reset inactivity timer when user submits MCQ answer
    resetInactivityTimer();

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

      // move to next question or finish
      if (currentMcqIndex < mcqList.length - 1) {
        setCurrentMcqIndex(currentMcqIndex + 1);
      } else {
        // Last question answered correctly
        submitFinalAnswers(newAnswers);
        toast.success("🎉 Listening practice completed!", {
          description: "Great job!",
          duration: 4000,
        });
        setChatCompleted(true);
        setIsCompleteDialogOpen(true);
      }
    } else {
      // incorrect answer
      pauseKbAudio();
      toast.error("Not quite, try again!", {
        description: "Listen to the audio again for a hint.",
        duration: 3000,
      });
      setShowReplayPopup(true);
    }
  };

  const handleQuestionnaireSubmit = (answers: {
    [questionId: string]: number;
  }) => {
    // Reset inactivity timer when user submits questionnaire
    resetInactivityTimer();

    const mcqAnswers: McqAnswer[] = Object.entries(answers).map(
      ([questionId, answerIndex]) => ({
        questionId,
        answerIndex,
      }),
    );
    if (!chatId) {
      console.log("Chat ID is not available. Cannot submit MCQs.");
      return;
    }
    const payload = { chatId, answers: mcqAnswers };
    logger.emitting(ChatEvents.SUBMIT_MCQS, payload);
    socketRef.current?.emit(ChatEvents.SUBMIT_MCQS, payload);
  };

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
      logger.info("Inactivity timer cleared");
    }
  };

  const startInactivityTimer = () => {
    // Don't start inactivity timer for listening mode since it doesn't have text/audio inputs
    if (mode === "listening-mode") {
      logger.info("Skipping inactivity timer for listening mode");
      return;
    }

    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(
      () => {
        if (socketRef.current && userId && topicId && chatId) {
          logger.info(
            "No user response for 2 minutes, emitting no_user_response",
          );
          sendPlaceholder();
          socketRef.current.emit("no_user_response", {
            userId,
            topicId,
            chatId,
          });
        }
      },
      2 * 60 * 1000,
    );
    logger.info("Inactivity timer started (2 minutes)");
  };

  const resetInactivityTimer = () => {
    logger.info("User activity detected - resetting inactivity timer");
    clearInactivityTimer();

    // Only restart if we're not in listening mode
    if (mode !== "listening-mode") {
      startInactivityTimer();
    }
  };

  useChatWindow3DSocket({
    SOCKET_URL,
    userId,
    topicId,
    mode,
    isInactiveDialogOpen,
    navigate,
    socketRef,
    activityTimerRef,
    listeningLoadingTimeoutRef,
    clickLocked,
    listeningStageRef,
    prefetchedQuizRef,
    hasListeningStartedRef,
    wantsQuizRef,
    wantsHintsRef,
    skipListeningCompletionStepRef,
    sessionTimerBaseRef,
    sessionTimerLastEmittedRef,
    onListeningStageChangeRef,
    resetActivityTimer,
    requestNextListeningStage,
    openListeningQuiz,
    startInactivityTimer,
    sendPlaceholder,
    removeLoadingMessage,
    hasUnlimitedSessions,
    emitSessionRemaining,
    unloadAudio,
    onTopicImage,
    onContentPayload,
    onListeningVideoUrl,
    setIsSocketConnected,
    setIsWaitingForResponse,
    setIsListeningLoading,
    setChatId,
    setListeningData,
    setHasPlayedIntroAudio,
    setIsContextCompleted,
    setShowListeningHints,
    setShowListeningCompletionCard,
    setPendingMcqPayload,
    setMessages,
    setListeningStage,
    setChatCompleted,
    setIsCompleteDialogOpen,
    setSessionLimitReached: _setSessionLimitReached,
    setContentPayload,
    setMcqList,
    setIsQuestionnaireOpen,
    setCurrentMcqIndex,
    setIsDuplicateConnectionModalOpen,
    setTopicImage,
    setUnlockedBadgeInfo,
    setIsBadgeModalOpen,
    setAccountBlockedData,
    setIsAccountBlockedOpen,
    setContentFilterWarningData,
    setIsContentFilterWarningOpen,
  });

  useEffect(() => {
    if (message.trim()) {
      resetInactivityTimer();
    }
  }, [message]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg &&
      lastMsg.type === "received" &&
      lastMsg.messageType === "text" &&
      !lastMsg.loading
    ) {
      startInactivityTimer();
    }

    return clearInactivityTimer;
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    logger.info("Form submitted.");
    onUserAction?.();

    // if (isSessionExpired) {
    //   logger.error("Cannot send message: session expired.");
    //   return;
    // }

    if (!message.trim() || !isSocketConnected || isWaitingForResponse) {
      logger.error("Cannot send message.", {
        message: message.trim(),
        isSocketConnected,
      });
      return;
    }
    setIsWaitingForResponse(true);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "sent",
        messageType: "text",
        text: message.trim(),
      },
    ]);
    sendPlaceholder();
    const payload = { userId, chatId, textMessage: message.trim() };
    logger.emitting(ChatEvents.TEXT, payload);
    socketRef.current?.emit(ChatEvents.TEXT, payload);
    setMessage("");
    resetActivityTimer();
    resetInactivityTimer();
  };

  const handleNextStage = () => {
    // Reset inactivity timer when user clicks next
    resetInactivityTimer();

    const nextMcqs =
      pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];

    if (mode === "listening-mode" && isAvatar3DContext) {
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
    }
    if (
      mode === "listening-mode" &&
      isAvatar3DContext &&
      skipListeningCompletionStepRef.current
    ) {
      const currentMcqs =
        pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];
      if (currentMcqs.length > 0) {
        setListeningStage("quiz");
        setMcqList(currentMcqs);
        setChatId(pendingMcqPayload.chatId);
        setListeningData((prevData: any) => ({
          ...prevData,
          ...pendingMcqPayload,
        }));
        setCurrentMcqIndex(0);
        setPendingMcqPayload(null);
        onListeningStageChangeRef.current?.("quiz", {
          kbAudioUrl: pendingMcqPayload.kbAudioUrl,
        });
        wantsQuizRef.current = false;
        skipListeningCompletionStepRef.current = false;
      } else {
        setListeningStage("quiz"); // Enter quiz stage anyway to show loading
        wantsQuizRef.current = true;
        if (!prefetchedQuizRef.current) {
          prefetchedQuizRef.current = true;
          requestNextListeningStage();
        }
        toast.info("Loading quiz...");
      }
      return;
    }

    if (socketRef.current && userId && topicId && chatId) {
      const payload = { userId, topicId, chatId };
      logger.emitting(ChatEvents.NEXT_STAGE, payload);
      if (mode === "listening-mode" && socketRef.current && chatId) {
        // Lock clicks and show loading state
        clickLocked.current = true;
        setIsListeningLoading(true);
        logger.emitting("next_listening_stage", { chatId });
        requestNextListeningStage();
        toast.info(
          listeningStage === "question_text"
            ? "Loading quiz..."
            : "Loading next part...",
        );

        // Set timeout to unlock if response takes too long (8 seconds)
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
        return;
      }
      socketRef.current.emit(ChatEvents.NEXT_STAGE, payload);
    } else {
      toast.error("Cannot proceed to next stage. Connection issue.");
      logger.error("Could not emit next_stage", {
        socket: !!socketRef.current,
        userId,
        topicId,
        chatId,
      });
    }
  };

  const handleResetChat = () => {
    logger.info("Handling chat reset - disconnecting and reconnecting socket.");
    if (!socketRef.current) return toast.error("Socket not available.");

    // First disconnect the socket
    socketRef.current.disconnect();

    // Wait a moment then reconnect and emit reset
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.connect();

        // Wait for connection to be established
        socketRef.current.on("connect", () => {
          const payload = { userId, topicId };
          logger.emitting(ChatEvents.RESET_CHAT, payload);
          socketRef.current?.emit(ChatEvents.RESET_CHAT, payload);

          setMessages([]);
          setChatCompleted(false);
          setIsCompleteDialogOpen(false);
          unloadAudio();
          toast.info("Resetting chat session...");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
    }, 500);
  };

  const handleStillThere = (isContinuing: boolean) => {
    setIsInactiveDialogOpen(false);
    logger.info(
      `User responded to inactivity dialog. Continuing: ${isContinuing}`,
    );
    if (isContinuing) {
      logger.info("Reconnecting socket due to user confirmation.");
      socketRef.current?.connect();
    } else {
      navigate(-1);
    }
  };

  const handleContentFilterWarningAcknowledge = () => {
    logger.info(
      "User acknowledged content filter warning. Reconnecting socket.",
    );
    setIsContentFilterWarningOpen(false);
    socketRef.current?.connect();
  };

  const handleShowAssessment = (assessments: any) => {
    logger.info("Showing assessment.", { assessments });
    onShowFeedback({ type: "assessment", content: assessments });
  };

  const handleLogout = () => {
    logger.info("Logging out user due to account block.");
    localStorage.removeItem("AiTutorUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    window.location.href = "/login";
  };


  const shouldShowModeTitle = !(isAvatar3DContext && mode === "reading-mode");
  const shouldShowListeningIntro =
    isAvatar3DContext &&
    listeningStage === "initial" &&
    !showListeningHints &&
    !showListeningCompletionCard;
  const shouldShowListeningHint =
    isAvatar3DContext && showListeningHints && !showListeningCompletionCard;
  const pendingMcqs =
    pendingMcqPayload?.mcqs || pendingMcqPayload?.questions || [];
  const listeningHints =
    [...(pendingMcqs || []), ...(mcqList || [])]
      .flatMap((mcq: any) =>
        typeof mcq?.hint === "string" ? parseListeningHintLines(mcq.hint) : [],
      )
      .filter((hint: string) => hint.length > 0) || [];
  const listeningHintText =
    listeningHints.length > 0
      ? listeningHints
      : listeningData?.questionText
        ? [listeningData.questionText]
        : [];
  const handleListeningAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    resetInactivityTimer();
  };
  const handleListeningContinueToQuiz = () => {
    setShowListeningCompletionCard(false);
    setShowListeningHints(false);
    skipListeningCompletionStepRef.current = true;
    handleNextStage();
  };
  const handleListeningReplayAvatarVideo = () => {
    setShowListeningCompletionCard(false);
    setShowListeningHints(false);
    skipListeningCompletionStepRef.current = false;
    setListeningStage("initial");
    setShowListeningHints(true);
    restartKbAudio();
  };
  const handleListeningNextClick = () => {
    if (clickLocked.current) return;
    clickLocked.current = true;
    setTimeout(() => (clickLocked.current = false), 2000);

    if (listeningStage === "question_text" && !showListeningCompletionCard) {
      setShowListeningCompletionCard(true);
      return;
    }

    (listeningStage === "quiz" ? handleSubmitAnswer : handleNextStage)();
  };
  const isListeningNextDisabled =
    (mode === "listening-mode" &&
      ((listeningStage === "initial" && !hasPlayedIntroAudio) ||
        (listeningStage === "question_text" && !isContextCompleted))) ||
    (mode === "listening-mode" &&
      listeningStage === "quiz" &&
      selectedAnswer === null);


  return {
    accountBlockedData,
    audioDuration,
    audioProgress,
    avatarVideoSrc,
    chatCompleted,
    chatLocked,
    contentFilterWarningData,
    contentPayload,
    contentRef,
    currentMcqIndex,
    handleContentFilterWarningAcknowledge,
    handleKbAudioEnd,
    handleListeningAnswerSelect,
    handleListeningContinueToQuiz,
    handleListeningNextClick,
    handleListeningReplayAvatarVideo,
    handleLogout,
    handleQuestionnaireSubmit,
    handleResetChat,
    handleShowAssessment,
    handleStillThere,
    handleSubmit,
    isAccountBlockedOpen,
    isAvatar3D,
    isAvatar3DContext,
    isBadgeModalOpen,
    isCompleteDialogOpen,
    isContentExpanded,
    isContentFilterWarningOpen,
    isCurrentlyPlaying,
    isDuplicateConnectionModalOpen,
    isInactiveDialogOpen,
    isListeningNextDisabled,
    isListeningStepTransitioning,
    isQueationnaireOpen,
    isRecording,
    isResetConfirmOpen,
    isSessionExpired,
    isSocketConnected,
    isTranscriptExpanded,
    isWaitingForResponse,
    listeningAvatarSeed,
    listeningData,
    listeningHintText,
    listeningStage,
    loadingAudioId,
    mcqList,
    message,
    messages,
    messagesEndRef,
    mode,
    navigate,
    onContentAudioComplete,
    onShowFeedback,
    playingAudioId,
    readingHeroActive,
    recordTime,
    resetInactivityTimer,
    selectedAnswer,
    sessionTimeRemaining,
    setIsBadgeModalOpen,
    setIsContentExpanded,
    setIsDuplicateConnectionModalOpen,
    setIsQuestionnaireOpen,
    setIsResetConfirmOpen,
    setIsTranscriptExpanded,
    setMessage,
    setShowReplayPopup,
    shouldShowExpandButton,
    shouldShowListeningHint,
    shouldShowListeningIntro,
    shouldShowModeTitle,
    shouldShowTranscriptExpandButton,
    showListeningCompletionCard,
    showReplayPopup,
    startRecording,
    stopRecording,
    topicImage,
    toggleAudio,
    transcriptRef,
    unlockedBadgeInfo,
  };
}