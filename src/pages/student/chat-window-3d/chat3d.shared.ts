export interface McqAnswer {
  questionId: string;
  answerIndex: number;
}

export const logger = {
  log: (message: string, ...optionalParams: any[]) => {
    console.log(`[${new Date().toISOString()}] ${message}`, ...optionalParams);
  },
  emitting: (event: string, payload: any) => {
    console.log(
      `%c[Socket.IO EMIT] >> %c${event}`,
      "color: #f39c12; font-weight: bold;",
      "color: #f39c12;",
      { payload },
    );
  },
  receiving: (event: string, payload: any) => {
    console.log(
      `%c[Socket.IO RECEIVE] << %c${event}`,
      "color: #2ecc71; font-weight: bold;",
      "color: #2ecc71;",
      { payload },
    );
  },
  info: (message: string, data?: any) => {
    console.info(
      `%c[INFO] %c${message}`,
      "color: #3498db; font-weight: bold;",
      "color: inherit;",
      data || "",
    );
  },
  error: (message: string, error?: any) => {
    console.error(
      `%c[ERROR] %c${message}`,
      "color: #e74c3c; font-weight: bold;",
      "color: inherit;",
      error || "",
    );
  },
};

export const ChatEvents = {
  RESET_CHAT: "reset_chat",
  GET_CHAT_HISTORY: "getChatHistory",
  AUDIO: "audio",
  TEXT: "text",
  SESSION_STATUS: "session_status",
  ERROR: "error",
  AI_RESPONSE: "AI_RESPONSE",
  TTS_AUDIO_URL: "TTS_AUDIO_URL",
  CHAT_HISTORY: "chat_history",
  CHAT_COMPLETED: "chat_completed",
  ATTACHMENT_URL: "attachment_url",
  SPEECH_TRANSCRIBED: "speech_transcribed",
  STREAMING_COMPLETE: "streaming_complete",
  SESSION_STATUS_UPDATE: "session_status",
  BADGE_UNLOCKED: "badge_unlocked",
  MCQ_LIST: "mcq_list",
  SUBMIT_MCQS: "submit_mcqs",
  MCQ_RESULT: "mcq_result",
  CONTENT_PAYLOAD: "content_payload",
  NEXT_STAGE: "next_stage",
  ACCOUNT_BLOCKED: "account_blocked",
  CONTENT_FILTER_WARNING: "content_filter_warning",
} as const;

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  connect_error: (err: Error) => void;
  [ChatEvents.ERROR]: (payload: { message: string; error?: any }) => void;
  [ChatEvents.RESET_CHAT]: (payload: {
    success: boolean;
    message: string;
  }) => void;
  [ChatEvents.CHAT_HISTORY]: (payload: {
    chatHistory: any[];
    chatId: string;
  }) => void;
  [ChatEvents.CHAT_COMPLETED]: (payload: { message: string }) => void;
  [ChatEvents.ATTACHMENT_URL]: (payload: { attachment: string }) => void;
  [ChatEvents.SPEECH_TRANSCRIBED]: (payload: {
    textMessage: string;
    assessments: any;
  }) => void;
  [ChatEvents.SESSION_STATUS_UPDATE]: (payload: {
    remainingSeconds: number;
  }) => void;
  [ChatEvents.AI_RESPONSE]: (payload: {
    ai_response: string;
    feedback: string;
  }) => void;
  [ChatEvents.TTS_AUDIO_URL]: (payload: { tts_audio_url: string }) => void;
  [ChatEvents.STREAMING_COMPLETE]: (payload: {
    isCompleted: boolean;
    ai_response: string;
    feedback: string;
    ttsAudioUrl: string;
    [key: string]: any;
  }) => void;
  [ChatEvents.BADGE_UNLOCKED]: (payload: {
    userId: string;
    key: string;
    name: string;
    description: string;
    iconUrl: string;
    pointValue: number;
  }) => void;
  [ChatEvents.CONTENT_PAYLOAD]: (payload: {
    contentPayload: {
      content: string;
      contentAudioUrl?: string;
      narrationVideoUrl?: string;
    };
  }) => void;
  [ChatEvents.ACCOUNT_BLOCKED]: (payload: {
    message: string;
    violationCount: number;
    accountStatus: string;
  }) => void;
  [ChatEvents.CONTENT_FILTER_WARNING]: (payload: {
    message: string;
    violationType: string;
    severity: string;
    violationCount: number;
    remainingWarnings: number;
  }) => void;
  next_stage: (payload: {
    userId: string;
    topicId: string;
    chatId: string | null;
  }) => void;
}

export interface ClientToServerEvents {
  [ChatEvents.RESET_CHAT]: (payload: {
    userId: string;
    topicId: string;
  }) => void;
  [ChatEvents.GET_CHAT_HISTORY]: (payload: {
    userId: string;
    topicId: string;
  }) => void;
  [ChatEvents.AUDIO]: (payload: {
    userId: string;
    chatId: string | null;
    audioBuffer: string;
    format: string;
  }) => void;
  [ChatEvents.TEXT]: (payload: {
    userId: string;
    chatId: string | null;
    textMessage: string;
  }) => void;
  [ChatEvents.SESSION_STATUS]: (payload: { userId: string }) => void;
  [ChatEvents.SUBMIT_MCQS]: (payload: {
    chatId: string;
    answers: McqAnswer[];
  }) => void;
  no_user_response: (payload: {
    userId: string;
    topicId: string;
    chatId: string;
  }) => void;
  [ChatEvents.CONTENT_PAYLOAD]: (payload: {
    userId: string;
    topicId: string;
    chatId: string;
  }) => void;
  [ChatEvents.NEXT_STAGE]: (payload: {
    userId: string;
    topicId: string;
    chatId: string | null;
  }) => void;
  next_listening_stage: (payload: { chatId: string }) => void;
}

export interface Message {
  id: string;
  messageType: "text" | "audio" | "loading";
  text?: string;
  type: "sent" | "received";
  feedback?: any;
  audioUrl?: string;
  audioURL?: string;
  audioPlayed?: boolean;
  hasFeedback?: boolean;
  hasAssessment?: boolean;
  assessments?: any;
  loading?: boolean;
}

export interface ChatWindowProps {
  onShowFeedback: (feedback: { type: string; content: any }) => void;
  onTopicImage: (imageUrl: string) => void;
  onContentPayload?: (payload: {
    content: string;
    contentAudioUrl?: string;
    narrationVideoUrl?: string;
  }) => void;
  onAudioPlaybackChange?: (isPlaying: boolean) => void;
  onNarrationComplete?: () => void;
  readingHeroActive?: boolean;
  isAvatar3D?: boolean;
  avatarVideoSrc?: string;
  onListeningVideoUrl?: (videoUrl?: string) => void;
  onContentAudioComplete?: (completed: boolean) => void;
  chatLocked?: boolean;
  onSessionTimeRemaining?: (remaining: number | null) => void;
  onListeningStageChange?: (
    stage: string | null,
    data?: { kbAudioUrl?: string },
  ) => void;
  onListeningAudioState?: (state: {
    isPlaying: boolean;
    isLoading: boolean;
    progress: number;
    duration: number;
  }) => void;
  onListeningAudioController?: (controller: {
    toggle: () => void;
    play: () => void;
    pause: () => void;
    restart: () => void;
  }) => void;
  listeningAvatarSeed?: number;
}

export function findLastIndex<T>(
  array: T[],
  predicate: (value: T) => boolean,
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return i;
  }
  return -1;
}

export const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
    sec % 60,
  ).padStart(2, "0")}`;

export const parseListeningHintLines = (rawHint: string): string[] => {
  const normalized = rawHint
    .replace(/\r\n/g, "\n")
    .replace(/[â€¢â—â–ªâ—¦]/g, "\n")
    .replace(/\s+-\s+/g, "\n")
    .replace(/\s*;\s*/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();

  return normalized
    .split("\n")
    .map((part) => part.trim().replace(/^[,-]\s*/, ""))
    .filter((part) => part.length > 0);
};

export const getSupportedMimeType = () => {
  const types = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
};

export const normalizeListeningStage = (
  incomingStage: string | null | undefined,
  payload: any,
): string | null => {
  if (incomingStage === "initial") return "initial";
  if (incomingStage === "question") return "question_text";
  if (incomingStage === "quiz") return "quiz";
  if (payload?.questionText) return "question_text";
  if ((payload?.mcqs || payload?.questions || []).length > 0) return "quiz";
  if (payload?.narrationText || payload?.narrationAudioUrl) return "initial";
  return null;
};

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
  (navigator.userAgent.includes("Mac") && "ontouchend" in document);

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      reader.result
        ? resolve((reader.result as string).split(",")[1])
        : reject("Blob read failed");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
