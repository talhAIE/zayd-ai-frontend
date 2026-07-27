import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { toast } from "sonner";
import { Howl, Howler } from "howler";
import {
  ChatEvents,
  blobToBase64,
  getSupportedMimeType,
  isIOS,
  logger,
} from "./chat3d.shared";
import type { Message } from "./chat3d.shared";

interface UseChatWindow3DAudioParams {
  mode: string | null;
  userId: string | undefined;
  chatId: string | null;
  socketRef: MutableRefObject<any>;
  onAudioPlaybackChange?: (isPlaying: boolean) => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendPlaceholder: () => void;
  setIsWaitingForResponse: (waiting: boolean) => void;
  resetActivityTimer: () => void;
  resetInactivityTimer: () => void;
  chatCompleted: boolean;
  isSessionExpired: boolean;
  listeningData: any;
  listeningStage: string | null;
  setIsContextCompleted: (completed: boolean) => void;
  setHasStartedContextAudio: (started: boolean) => void;
  setHasPlayedIntroAudio: (played: boolean) => void;
}

export function useChatWindow3DAudio({
  mode,
  userId,
  chatId,
  socketRef,
  onAudioPlaybackChange,
  setMessages,
  sendPlaceholder,
  setIsWaitingForResponse,
  resetActivityTimer,
  resetInactivityTimer,
  chatCompleted,
  isSessionExpired,
  listeningData,
  listeningStage,
  setIsContextCompleted,
  setHasStartedContextAudio,
  setHasPlayedIntroAudio,
}: UseChatWindow3DAudioParams) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const kbAudioSeekRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isCanceledRef = useRef(false);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRecordingEndTimeRef = useRef<number | null>(null);
  const onEndCalledRef = useRef(false);

  const clearAudioProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setAudioProgress(0);
    setAudioDuration(0);
  }, []);

  const cleanupRecording = useCallback(() => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setRecordTime(0);
    streamRef.current = null;
    mediaRecorderRef.current = null;
    lastRecordingEndTimeRef.current = Date.now();
  }, []);

  const stopRecording = useCallback(
    async (cancel = false) => {
      logger.info(`Stopping recording. Cancel: ${cancel}`);
      isCanceledRef.current = cancel;
      if (mediaRecorderRef.current?.state === "recording") {
        if (!cancel && isIOS()) {
          logger.info("iOS: Forcing requestData() before stop.");
          mediaRecorderRef.current.requestData();
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        mediaRecorderRef.current.stop();
      } else {
        cleanupRecording();
      }
    },
    [cleanupRecording],
  );

  useEffect(() => {
    if (isSessionExpired) {
      if (isRecording) {
        stopRecording(true);
      }
      return;
    }
  }, [isRecording, isSessionExpired, stopRecording]);

  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return;

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

    logger.info("Setting up audio unlock listeners...");
    document.addEventListener("touchstart", unlock, true);
    document.addEventListener("touchend", unlock, true);
    document.addEventListener("click", unlock, true);

    return () => {
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("touchend", unlock, true);
      document.removeEventListener("click", unlock, true);
    };
  }, [isAudioUnlocked]);

  useEffect(() => {
    const cleanup = unlockAudio();
    if (cleanup) return cleanup;
  }, [unlockAudio]);

  const startRecording = useCallback(async () => {
    logger.info("Start recording requested.");
    resetInactivityTimer();

    if (chatCompleted || isSessionExpired) {
      toast.warning(
        isSessionExpired
          ? "Session time is over. You cannot send more messages."
          : "Cannot record: The chat session is complete.",
      );
      return;
    }

    if (isIOS() && lastRecordingEndTimeRef.current) {
      const timeSinceLast = Date.now() - lastRecordingEndTimeRef.current;
      if (timeSinceLast < 1000) {
        logger.info(`iOS cooldown active: waiting ${1000 - timeSinceLast}ms`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 - timeSinceLast),
        );
      }
    }

    try {
      logger.info("Requesting user media...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        toast.error(
          "Your browser does not support any of the required audio formats.",
        );
        logger.error("No supported MIME type found for MediaRecorder.");
        cleanupRecording();
        return;
      }
      logger.info(`Using supported MIME type: ${mimeType}`);

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      isCanceledRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const wasCanceled = isCanceledRef.current;
        cleanupRecording();

        if (wasCanceled) {
          logger.info("Recording canceled by user.");
          return;
        }
        if (audioChunksRef.current.length === 0) {
          logger.error("No audio chunks recorded, stopping.");
          toast.error("No audio was captured. Please try again.");
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 200) {
          logger.error(`Recorded blob is too small (${audioBlob.size} bytes).`);
          toast.error("Recording was too short. Please try again.");
          return;
        }

        const audioURL = URL.createObjectURL(audioBlob);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: "sent",
            messageType: "audio",
            audioURL,
          },
        ]);

        sendPlaceholder();
        setIsWaitingForResponse(true);
        const audioBase64 = await blobToBase64(audioBlob);
        const format = mimeType.split("/")[1].split(";")[0];
        const payload = { userId, chatId, audioBuffer: audioBase64, format };
        socketRef.current?.emit(ChatEvents.AUDIO, payload);
        resetActivityTimer();
        resetInactivityTimer();
      };

      recorder.onerror = (event) => {
        logger.error("MediaRecorder error:", event);
        toast.error("An unknown error occurred during recording.");
        cleanupRecording();
      };

      recorder.start();
      setIsRecording(true);
      recordTimerRef.current = setInterval(
        () => setRecordTime((time) => time + 1),
        1000,
      );
    } catch (err: any) {
      logger.error("CRITICAL: Error starting recording:", {
        name: err.name,
        message: err.message,
      });
      let errorMessage = "An unknown microphone error occurred.";
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "Microphone access denied. Please enable it in your browser settings.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage =
          "No microphone found. Please connect a microphone and try again.";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage =
          "Your microphone is already in use by another application.";
      }
      toast.error(errorMessage);
      cleanupRecording();
    }
  }, [
    chatCompleted,
    chatId,
    cleanupRecording,
    isSessionExpired,
    resetActivityTimer,
    resetInactivityTimer,
    sendPlaceholder,
    setIsWaitingForResponse,
    setMessages,
    socketRef,
    userId,
  ]);

  const toggleAudio = useCallback(
    (id: string, audioUrl: string | undefined, onEnd?: () => void) => {
      if (!audioUrl) return;

      resetInactivityTimer();

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
          if (id === "kb-audio" && mode === "listening-mode") {
            onEndCalledRef.current = false;
          }
        }
        return;
      }

      if (soundRef.current) {
        soundRef.current.off();
        soundRef.current.stop();
      }

      setPlayingAudioId(id);
      setIsCurrentlyPlaying(false);
      setLoadingAudioId(id);
      clearAudioProgress();
      onEndCalledRef.current = false;

      const isBlob = audioUrl.startsWith("blob:");
      let format: string | undefined;
      if (isBlob) {
        const mimeType = getSupportedMimeType();
        if (mimeType) {
          format = mimeType.split("/")[1]?.split(";")[0];
        }
        if (!format) {
          format = "webm";
        }
      }

      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        ...(format ? { format: [format] } : {}),
        onplay: () => {
          setPlayingAudioId(id);
          setIsCurrentlyPlaying(true);
          setLoadingAudioId(null);
          onAudioPlaybackChange?.(true);
          if (id === "kb-audio" && mode === "listening-mode") {
            setHasStartedContextAudio(true);
            onEndCalledRef.current = false;
          }
          setAudioDuration(sound.duration());
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          progressIntervalRef.current = setInterval(() => {
            const seek = sound.seek() || 0;
            setAudioProgress(seek);
            if (id === "kb-audio") {
              kbAudioSeekRef.current = Number(seek);
            }
            if (
              seek >= sound.duration() - 0.1 &&
              onEnd &&
              !onEndCalledRef.current
            ) {
              onEndCalledRef.current = true;
              onEnd();
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
              progressIntervalRef.current = null;
            }
          }, 100);
        },
        onpause: () => {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          setIsCurrentlyPlaying(false);
          onAudioPlaybackChange?.(false);
          if (id === "kb-audio") {
            kbAudioSeekRef.current = Number(sound.seek() || 0);
            if (mode === "listening-mode") {
              setIsContextCompleted(false);
              setHasStartedContextAudio(false);
            }
          }
        },
        onstop: () => {
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          setLoadingAudioId(null);
          clearAudioProgress();
          onAudioPlaybackChange?.(false);
          if (id === "kb-audio") {
            kbAudioSeekRef.current = 0;
            if (mode === "listening-mode") {
              setHasStartedContextAudio(false);
              setIsContextCompleted(false);
            }
          }
        },
        onend: () => {
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          setLoadingAudioId(null);
          clearAudioProgress();
          onAudioPlaybackChange?.(false);
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
        onplayerror: (soundId: number, error: any) => {
          logger.error("Howler play error:", { soundId, error });
          toast.error("Could not play audio.");
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          setLoadingAudioId(null);
          clearAudioProgress();
        },
        onloaderror: (soundId: number, error: any) => {
          logger.error("Howler load error:", { soundId, error });
          toast.error("Could not load audio.");
          setPlayingAudioId(null);
          setIsCurrentlyPlaying(false);
          setLoadingAudioId(null);
          clearAudioProgress();
        },
      });

      sound.play();
      soundRef.current = sound;
    },
    [
      clearAudioProgress,
      mode,
      onAudioPlaybackChange,
      playingAudioId,
      resetInactivityTimer,
      setHasStartedContextAudio,
      setIsContextCompleted,
    ],
  );

  const handleKbAudioEnd = useCallback(() => {
    setIsContextCompleted(true);
    if (listeningStage === "initial") {
      setHasPlayedIntroAudio(true);
    }
  }, [listeningStage, setHasPlayedIntroAudio, setIsContextCompleted]);

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
  }, [handleKbAudioEnd, listeningData, playingAudioId, toggleAudio]);

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
  }, [clearAudioProgress, handleKbAudioEnd, listeningData, toggleAudio]);

  const unloadAudio = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
    clearAudioProgress();
  }, [clearAudioProgress]);

  return {
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
  };
}
