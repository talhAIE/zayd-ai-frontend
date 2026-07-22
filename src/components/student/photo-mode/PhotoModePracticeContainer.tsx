import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Image as ImageIcon, Play, Pause, ArrowRight, Mic, Square, Info, Headphones, RotateCcw, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoTopicItem } from "@/pages/student/topics/PhotoModeTopics";
import { useAppSelector } from "@/redux/hooks";
import { PhotoModeCompletion } from "./PhotoModeCompletion";

interface PhotoModePracticeContainerProps {
  topic: DemoTopicItem;
  onBack?: () => void;
}

export type FeedbackState = "NONE" | "SUCCESS" | "ERROR";

type DemoPhotoItem = {
  orderIndex: number;
  sentence: string;
  imageUrl?: string | null;
  arabicText?: string | null;
  arabicSentence?: string | null;
  arabicNarrationAudioUrl?: string | null;
  englishSentenceAudioUrl?: string | null;
  arabicTurnAudioUrl?: string | null;
  tryAgainArabicText?: string;
};

type DemoPhotoItemEvent = {
  chatId: string;
  topicId: string;
  currentItemIndex: number;
  totalItems: number;
  item?: DemoPhotoItem;
};

type DemoPhotoPayloadEvent = DemoPhotoItemEvent & {
  completed: boolean;
  passedItemIndexes: number[];
};

type DemoPhotoResultEvent = {
  chatId: string;
  topicId: string;
  itemIndex: number;
  expectedText: string;
  recognizedText: string;
  isCorrect: boolean;
  score: number | null;
  completed: boolean;
  retryMessage?: string;
  totalItems?: number;
  passedItemIndexes?: number[];
  nextItem?: DemoPhotoItem;
};

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

const getSupportedMimeType = () => {
  const types = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg"];
  return types.find((type) => MediaRecorder.isTypeSupported(type));
};

const getAudioFormat = (mimeType: string) => {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      reader.result
        ? resolve((reader.result as string).split(",")[1])
        : reject(new Error("Blob read failed"));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const PhotoModePracticeContainer: React.FC<PhotoModePracticeContainerProps> = ({ topic, onBack }) => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGuidePlaying, setIsGuidePlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("NONE");
  const [chatId, setChatId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<DemoPhotoItem | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(10);
  const [, setPassedItemIndexes] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<DemoPhotoResultEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedMimeType, setRecordedMimeType] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrlRef = useRef<string | null>(null);
  const audioSessionRef = useRef(0);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitAfterStopRef = useRef(false);
  const holdNextItemRef = useRef(false);
  const pendingNextItemRef = useRef<DemoPhotoItemEvent | null>(null);
  const steps = [1, 2, 3, 4];

  const sentence = currentItem?.sentence || "";
  const arabicSentence = currentItem?.arabicText || currentItem?.arabicSentence || sentence;
  const imageUrl = currentItem?.imageUrl || topic.attachmentUrl;
  const photoNumber = currentItem?.orderIndex || currentItemIndex + 1;
  const setAudioPlaybackState = (guideAudio: boolean, isActive: boolean) => {
    setIsPlaying(!guideAudio && isActive);
    setIsGuidePlaying(guideAudio && isActive);
  };

  const formatAudioTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const stopAudio = () => {
    audioSessionRef.current += 1;
    const audio = audioRef.current;
    audioRef.current = null;
    activeAudioUrlRef.current = null;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
      audio.ontimeupdate = null;
      audio.onplay = null;
      audio.onpause = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setAudioPlaybackState(false, false);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  };

  const playAudio = (audioUrl?: string | null, guideAudio = false) => {
    if (!audioUrl) {
      toast.error("Audio is not available for this sentence.");
      return;
    }

    const activeAudio = audioRef.current;
    if (activeAudio && activeAudioUrlRef.current === audioUrl) {
      if (activeAudio.paused) {
        void activeAudio.play().catch((error: unknown) => {
          if (audioRef.current !== activeAudio || (error instanceof DOMException && error.name === "AbortError")) return;
          setAudioPlaybackState(guideAudio, false);
          toast.error("Could not play audio.");
        });
      } else {
        activeAudio.pause();
      }
      return;
    }

    stopAudio();
    const session = audioSessionRef.current;
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioUrl;
    audioRef.current = audio;
    activeAudioUrlRef.current = audioUrl;
    const isCurrentAudio = () => audioSessionRef.current === session && audioRef.current === audio;
    audio.onloadedmetadata = () => {
      if (isCurrentAudio()) setAudioDuration(audio.duration);
    };
    audio.ontimeupdate = () => {
      if (isCurrentAudio()) setAudioCurrentTime(audio.currentTime);
    };
    audio.onplay = () => {
      if (isCurrentAudio()) setAudioPlaybackState(guideAudio, true);
    };
    audio.onpause = () => {
      if (isCurrentAudio()) setAudioPlaybackState(guideAudio, false);
    };
    audio.onended = () => {
      if (!isCurrentAudio()) return;
      setAudioPlaybackState(guideAudio, false);
      setAudioCurrentTime(audio.duration || 0);
    };
    audio.onerror = () => {
      if (!isCurrentAudio()) return;
      setAudioPlaybackState(guideAudio, false);
      toast.error("Could not play audio.");
    };
    void audio.play().catch((error: unknown) => {
      if (!isCurrentAudio() || (error instanceof DOMException && error.name === "AbortError")) return;
      setAudioPlaybackState(guideAudio, false);
      toast.error("Could not play audio.");
    });
  };

  const applyItemPayload = (payload: DemoPhotoItemEvent) => {
    setChatId(payload.chatId);
    setCurrentItemIndex(payload.currentItemIndex ?? 0);
    setTotalItems(payload.totalItems ?? 10);
    if (payload.item) setCurrentItem(payload.item);
    setCurrentStep(1);
    setFeedbackState("NONE");
    setLastResult(null);
    setRecordedAudioBlob(null);
    setRecordedMimeType("");
    setRecordingTime(0);
    stopAudio();
  };

  useEffect(() => {
    if (!user?.id || !accessToken || !topic.id) return;

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("demo_photo_start", { userId: user.id, topicId: topic.id });
    });

    socket.on("connect_error", () => {
      toast.error("Could not connect to Photo Mode.");
    });

    socket.on("demo_photo_payload", (payload: DemoPhotoPayloadEvent) => {
      setPassedItemIndexes(payload.passedItemIndexes ?? []);
      if (payload.completed) {
        setIsTopicCompleted(true);
        return;
      }
      if (payload.item) applyItemPayload(payload);
    });

    socket.on("demo_photo_item", (payload: DemoPhotoItemEvent) => {
      if (holdNextItemRef.current) {
        pendingNextItemRef.current = payload;
        holdNextItemRef.current = false;
        return;
      }
      applyItemPayload(payload);
    });

    socket.on("demo_photo_result", (payload: DemoPhotoResultEvent) => {
      setIsSubmitting(false);
      setLastResult(payload);
      if (payload.passedItemIndexes) setPassedItemIndexes(payload.passedItemIndexes);
      if (payload.completed) {
        setIsTopicCompleted(true);
        return;
      }
      if (payload.isCorrect) {
        holdNextItemRef.current = false;
        if (payload.nextItem) {
          applyItemPayload({
            chatId: payload.chatId,
            topicId: payload.topicId,
            currentItemIndex: payload.itemIndex + 1,
            totalItems: payload.totalItems ?? totalItems,
            item: payload.nextItem,
          });
          return;
        }
        setFeedbackState("SUCCESS");
      } else {
        setFeedbackState("ERROR");
      }
    });

    socket.on("demo_photo_try_again", (payload: DemoPhotoResultEvent) => {
      setIsSubmitting(false);
      setLastResult(payload);
      setFeedbackState("ERROR");
    });

    socket.on("demo_photo_completed", () => {
      setIsSubmitting(false);
      setIsTopicCompleted(true);
    });

    socket.on("error", (payload: { message?: string }) => {
      setIsSubmitting(false);
      toast.error(payload?.message || "Photo Mode error.");
    });

    return () => {
      stopAudio();
      socket.disconnect();
    };
  }, [accessToken, topic.id, user?.id]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const submitRecording = async (audioBlob = recordedAudioBlob, mimeType = recordedMimeType) => {
    if (!chatId || !currentItem) return;
    if (isRecording) {
      submitAfterStopRef.current = true;
      stopRecording();
      return;
    }
    if (!audioBlob || !mimeType) {
      toast.error("Please record your voice first.");
      return;
    }
    try {
      setIsSubmitting(true);
      const audioBuffer = await blobToBase64(audioBlob);
      socketRef.current?.emit("demo_photo_submit_audio", {
        chatId,
        itemIndex: currentItem.orderIndex - 1,
        audioBuffer,
        format: getAudioFormat(mimeType),
      });
    } catch {
      setIsSubmitting(false);
      toast.error("Could not submit your recording.");
    }
  };

  const startRecording = async () => {
    if (!chatId || !currentItem || isSubmitting) return;
    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      toast.error("Your browser does not support audio recording.");
      return;
    }
    try {
      stopAudio();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setRecordedAudioBlob(null);
      setRecordedMimeType(mimeType);
      setRecordingTime(0);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 200) {
          toast.error("No audio was captured. Please try again.");
          return;
        }
        setRecordedAudioBlob(audioBlob);
        setRecordedMimeType(mimeType);
        if (submitAfterStopRef.current) {
          submitAfterStopRef.current = false;
          await submitRecording(audioBlob, mimeType);
        }
      };
      recorder.start();
      setIsRecording(true);
      recordTimerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch {
      toast.error("Microphone access is needed to record your voice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReRecord = () => {
    if (isRecording) stopRecording();
    setRecordingTime(0);
    setRecordedAudioBlob(null);
    setRecordedMimeType("");
    setFeedbackState("NONE");
    setCurrentStep(4);
    startRecording();
  };

  const handleTryAgain = () => {
    setFeedbackState("NONE");
    setCurrentStep(4);
    setRecordingTime(0);
    setRecordedAudioBlob(null);
    setRecordedMimeType("");
  };

  const handleNextSentence = () => {
    const pending = pendingNextItemRef.current;
    pendingNextItemRef.current = null;
    setFeedbackState("NONE");
    if (pending) {
      applyItemPayload(pending);
      return;
    }
    setCurrentStep(1);
  };

  const handleStepChange = (step: number) => {
    if (feedbackState !== "NONE") return;
    stopAudio();
    setCurrentStep(step);
    if (step === 3) playAudio(currentItem?.arabicTurnAudioUrl, true);
    if (step === 4) setRecordingTime(0);
  };
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
        subtitle: "Speak the English sentence clearly. Try to match the guide's rhythm.",
        buttonText: isSubmitting ? "Checking..." : "Submit & Continue",
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
    return {
      title: "Sentence Builder",
      subtitle: "Listen to the narration and review the sentence structures.",
      buttonText: "Next Step",
      buttonClass: "bg-[#06CCB5] hover:bg-[#05b8a3]",
    };
  };

  const stepHeader = getStepContent();

  const renderPhoto = () => (
    <div className="lg:col-span-6 flex flex-col gap-3">
      <div className="w-full aspect-[2528/1696] rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
        {imageUrl ? (
          <img src={imageUrl} alt={topic.topicName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6E748F]">Photo loading...</div>
        )}
      </div>
      <div className="flex items-center gap-2 text-[#6E748F]">
        <ImageIcon className="w-4 h-4 text-[#6E748F]" />
        <span className="font-outfit font-normal text-[12px] leading-[15px]">
          Photo {photoNumber} of {totalItems}
        </span>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6 font-outfit">
      <div className="w-full bg-white rounded-[24px] border border-[#E5E7EB] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
          <div className="flex flex-col gap-1">
            <h3 className="font-outfit font-bold text-[18px] leading-[23px] text-[#0F1450]">
              {stepHeader.title}
            </h3>
            <p className="font-outfit font-normal text-[13px] leading-[16px] text-[#6E748F]">
              {stepHeader.subtitle}
            </p>
          </div>

          <div className="flex items-center justify-center w-full sm:w-auto gap-1.5">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => handleStepChange(step)}
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

        {!currentItem ? (
          <div className="min-h-[360px] flex items-center justify-center text-[#6E748F]">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Loading Photo Mode...
          </div>
        ) : feedbackState === "SUCCESS" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            {renderPhoto()}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#E8F5E9] rounded-[16px] p-6 border border-emerald-200 min-h-[321px]">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#16A34A] text-white shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h2 className="font-outfit font-bold text-[22px] leading-[28px] text-[#0F1450]">
                  Excellent pronunciation!
                </h2>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <h3 className="font-outfit font-bold text-[26px] leading-[33px] text-[#16A34A] dir-rtl">
                  {arabicSentence}
                </h3>
                <p className="font-outfit font-normal text-[14px] leading-[18px] text-[#6E748F]">
                  &quot;{sentence}&quot;
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-[12px] p-4 border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#16A34A] text-white shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#0F1450]">
                    Pronunciation Match
                  </span>
                  <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">
                    Score: {lastResult?.score === null || lastResult?.score === undefined ? "-" : Math.round(lastResult.score)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : feedbackState === "ERROR" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            {renderPhoto()}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#F59E0B]/10 rounded-[16px] p-6 border border-[#F59E0B]/20 min-h-[296px]">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F59E0B] text-white shadow-md">
                  <Info className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h2 className="font-outfit font-bold text-[22px] leading-[28px] text-[#0F1450]">
                  Not a Match
                </h2>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <h3 className="font-outfit font-bold text-[26px] leading-[33px] text-[#0F1450] dir-rtl">
                  {lastResult?.retryMessage || currentItem?.tryAgainArabicText || "\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649"}
                </h3>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-[12px] p-3 border border-gray-100 shadow-sm">
                <button
                  onClick={() => playAudio(currentItem?.englishSentenceAudioUrl, true)}
                  aria-label="Listen again"
                  className="flex items-center justify-center w-9 h-8 rounded-[8px] bg-[#5C9DFF] text-white hover:brightness-105 transition-all shrink-0"
                >
                  <Headphones className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-col text-left">
                  <span className="font-outfit font-semibold text-[13px] leading-[16px] text-[#0F1450]">Listen Again</span>
                  <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">
                    Hear the correct pronunciation guide.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 4 ? (          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full flex flex-col items-center justify-center gap-6 bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm">
              <div className="relative flex items-center justify-center">
                <div className={`flex items-center justify-center w-[112px] h-[112px] rounded-full transition-all duration-500 ${isRecording ? "bg-blue-100 animate-ping" : "bg-[#5C9DFF]/10"}`} />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute flex items-center justify-center w-[88px] h-[88px] rounded-full shadow-[0px_8px_16px_rgba(6,204,181,0.25)] transition-all duration-300 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#5C9DFF] hover:bg-blue-600"}`}
                >
                  {isRecording ? <Square className="w-8 h-8 fill-white text-white" /> : <Mic className="w-9 h-9 text-white stroke-[2]" />}
                </button>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <span className="font-outfit font-bold text-[32px] leading-[40px] text-[#282828]">
                  {formatTime(recordingTime)}
                </span>
                <p className="font-outfit font-semibold text-[15px] leading-[19px] text-[#6E748F]">
                  {isSubmitting ? "Checking pronunciation..." : isRecording ? "Recording... Speak the English sentence clearly" : recordedAudioBlob ? "Recording ready to submit" : "Tap mic to start recording"}
                </p>
              </div>
              <div className="w-full max-w-[500px] h-[64px] bg-[#5C9DFF]/15 border border-[#5C9DFF]/20 rounded-[12px] px-4 py-3 flex items-center justify-center gap-1">
                {[12, 20, 8, 16, 28, 32, 24, 14, 18, 30, 10, 16, 24, 20, 12, 18, 26, 14, 22, 16, 20, 12].map((h, i) => (
                  <span
                    key={i}
                    className={`w-[4px] rounded-[2px] ${isRecording ? "bg-[#5C9DFF] animate-pulse" : "bg-[#5C9DFF]"}`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleReRecord}
                  className="h-[43px] px-6 border-[1.5px] border-[#0F1450] bg-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] text-[#0F1450] hover:bg-gray-50 transition-colors"
                >
                  Re-record
                </button>
                <button
                  onClick={() => submitRecording()}
                  disabled={isSubmitting}
                  className="h-[43px] px-6 bg-[#06CCB5] hover:bg-[#05b8a3] text-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] shadow-[0px_4px_8px_rgba(6,204,181,0.18)] transition-all disabled:opacity-60"
                >
                  {isSubmitting ? "Checking..." : "Submit Recording"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {renderPhoto()}
            {currentStep === 3 ? (
              <div className="lg:col-span-6 flex flex-col justify-between gap-5 bg-[#F0F4FA] rounded-[16px] p-6 border border-[#E0E7F5] min-h-[300px]">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#06CCB5]/10 border border-[#06CCB5] rounded-[20px]">
                    <span className="font-outfit font-bold text-[14px] leading-[18px] text-[#06CCB5]">Your turn</span>
                  </div>
                  <span className="font-outfit font-medium text-[18px] leading-[23px] text-[#6E748F]">
                    (It's your turn to read)
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[12px] p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playAudio(currentItem?.arabicTurnAudioUrl, true)}
                      aria-label={isGuidePlaying ? "Pause guide audio" : "Play guide audio"}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-[#06CCB5] text-white hover:brightness-105 transition-all shrink-0"
                    >
                      {isGuidePlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <div className="flex flex-col text-left">
                      <span className="font-outfit font-semibold text-[14px] leading-[18px] text-[#0F1450]">Listen to guide audio</span>
                      <span className="font-outfit font-normal text-[12px] leading-[15px] text-[#6E748F]">Native speaker pronunciation guide</span>
                    </div>
                  </div>
                  <Mic className="w-6 h-6 text-[#06CCB5]" />
                </div>
              </div>
            ) : (
              <div className="lg:col-span-6 flex flex-col justify-center gap-5 bg-[#F0F4FA] rounded-[16px] p-6 border border-[#E0E7F5]">
                <div className="flex flex-col gap-3 bg-white border border-[#E5E7EB] rounded-[12px] p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playAudio(currentStep === 1 ? currentItem?.arabicNarrationAudioUrl : currentItem?.englishSentenceAudioUrl)}
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#06CCB5] text-white hover:brightness-105 transition-all shrink-0"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                    <div className="flex-1 flex items-center gap-[3px] h-8">
                      {[16, 24, 12, 18, 30, 26, 14, 20, 10, 22, 28, 16, 12, 18, 8, 24, 14, 18, 26].map((height, i) => (
                        <span
                          key={i}
                          className={`w-[3px] rounded-[1.5px] transition-all duration-300 ${i < 10 && isPlaying ? "bg-[#06CCB5] animate-pulse" : i < 10 ? "bg-[#06CCB5]" : "bg-[#6E748F]/40"}`}
                          style={{ height: `${height}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[12px] font-semibold text-[#06CCB5] font-outfit">
                    <span>{formatAudioTime(audioCurrentTime)}</span>
                    <span className="text-[#6E748F]">{formatAudioTime(audioDuration)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#E5E7EB]/50">
          {feedbackState === "SUCCESS" ? (
            <span className="bg-[#F5F5F6] text-[#6E748F] rounded-[20px] px-3.5 py-1.5 text-[13px] font-semibold font-outfit cursor-pointer hover:bg-gray-200 transition-colors">
              View Breakdown
            </span>
          ) : feedbackState === "ERROR" ? (
            <button
              onClick={() => {
                setFeedbackState("NONE");
                setCurrentStep(4);
              }}
              className="h-[42px] px-5 bg-white border border-[#6E748F] rounded-[12px] font-outfit font-semibold text-[14px] leading-[18px] text-[#6E748F] hover:bg-gray-50 transition-colors"
            >
              Skip Sentence
            </button>
          ) : null}

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
                  submitRecording();
                } else {
                  stopAudio();
                  if (currentStep === 2) {
                    playAudio(currentItem?.arabicTurnAudioUrl, true);
                  }
                  setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
                }
              }}
              disabled={isSubmitting}
              className={`h-[43px] px-6 text-white rounded-[12px] font-outfit font-bold text-[15px] flex items-center gap-2 shadow-none transition-all disabled:opacity-60 ${stepHeader.buttonClass}`}
            >
              <span>{stepHeader.buttonText}</span>
              {isSubmitting ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModePracticeContainer;