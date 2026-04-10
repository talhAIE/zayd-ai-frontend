import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FeedbackSection from './FeedbackSection';
import FeedbackSectionModal from './FeedbackSectionModel';
import PhotoDisplay from './PhotoDisplay';
import ChatWindow from './ChatWindow';
import AudioPlayer from './AudioPlayer';
import AvatarModeLayout from '@/components/3d/AvatarModeLayout';
import AvatarHeaderBar from '@/components/3d/AvatarHeaderBar';

interface Assessment {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  prosodyScore: number;
}

interface Feedback {
  type: string;
  content: string | Assessment;
}

const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(
    sec % 60,
  ).padStart(2, '0')}`;

const Chat: React.FC = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(true);
  const [isFeedbackMobile, setIsFeedbackMobile] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [topicImage, setTopicImage] = useState<string | null>(null);
  const [isAvatarSyncPlaying, setIsAvatarSyncPlaying] = useState(false);
  const [narrationVideoUrl, setNarrationVideoUrl] = useState<string | null>(
    null,
  );
  const [listeningVideoUrl, setListeningVideoUrl] = useState<string | null>(
    null,
  );
  const [isNarrationComplete, setIsNarrationComplete] = useState(false);
  const [isContentAudioComplete, setIsContentAudioComplete] = useState(true);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(
    null,
  );
  const [listeningStage, setListeningStage] = useState<string | null>(null);
  const [listeningAudioUrl, setListeningAudioUrl] = useState<string | null>(null);
  const [listeningAudioState, setListeningAudioState] = useState({
    isPlaying: false,
    progress: 0,
    duration: 0,
  });
  const listeningAudioControlRef = React.useRef<{
    toggle?: () => void;
    play?: () => void;
    pause?: () => void;
    restart?: () => void;
  } | null>(null);
  const [listeningAvatarSeed, setListeningAvatarSeed] = useState(0);
  const lastListeningProgressRef = React.useRef(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'chat-mode';
  const variant = searchParams.get('variant') || 'default';
  const isAvatar3D = variant === '3d';
  const isReading3D = isAvatar3D && mode === 'reading-mode';
  const isHeroMode3D = isReading3D;
  const loopVideoUrl = '/avatar/placeholder.mp4';

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const smallQuery = window.matchMedia('(max-width: 640px)');
    const narrowQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(max-width: 1024px)');

    const update = () => {
      setIsSmallScreen(smallQuery.matches);
      setIsNarrowScreen(narrowQuery.matches);
      setIsTabletOrBelow(tabletQuery.matches);
    };

    update();
    smallQuery.addEventListener?.('change', update);
    narrowQuery.addEventListener?.('change', update);
    tabletQuery.addEventListener?.('change', update);

    return () => {
      smallQuery.removeEventListener?.('change', update);
      narrowQuery.removeEventListener?.('change', update);
      tabletQuery.removeEventListener?.('change', update);
    };
  }, []);

  // By wrapping these functions in `useCallback`, we ensure they are stable
  // and don't get recreated on every render. This prevents the child
  // component's `useEffect` from re-triggering.
  const handleShowFeedback = useCallback((feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setIsFeedbackOpen(true);
    setIsFeedbackMobile(true);
  }, []); // Empty dependency array is fine because state setters are stable.

  const handleTopicImage = useCallback((imageUrl: string) => {
    setTopicImage(imageUrl);
  }, []); // Empty dependency array here as well.

  const handleContentPayload = useCallback(
    (payload: { narrationVideoUrl?: string }) => {
      if (payload?.narrationVideoUrl) {
        setNarrationVideoUrl(payload.narrationVideoUrl);
      } else {
        setNarrationVideoUrl(null);
      }
    },
    [],
  );

  const handleListeningVideoUrl = useCallback((videoUrl?: string) => {
    if (videoUrl) {
      setListeningVideoUrl(videoUrl);
    } else {
      setListeningVideoUrl(null);
    }
  }, []);

  const handleAudioPlaybackChange = useCallback(
    (isPlaying: boolean) => {
      setIsAvatarSyncPlaying(isPlaying);
    },
    [],
  );

  const handleNarrationComplete = useCallback(() => {
    setIsNarrationComplete(true);
  }, []);

  const handleContentAudioComplete = useCallback((completed: boolean) => {
    setIsContentAudioComplete(completed);
    if (isReading3D) {
      setIsNarrationComplete(completed);
    }
  }, [isReading3D]);

  useEffect(() => {
    if (!isHeroMode3D) {
      setIsNarrationComplete(true);
      return;
    }
    if (!narrationVideoUrl) {
      setIsNarrationComplete(true);
      return;
    }
    setIsNarrationComplete(false);
  }, [isHeroMode3D, narrationVideoUrl]);

  useEffect(() => {
    if (!isReading3D) {
      setIsContentAudioComplete(true);
    }
  }, [isReading3D]);

  useEffect(() => {
    if (mode !== 'listening-mode') return;
    if (!listeningAudioState.isPlaying) {
      lastListeningProgressRef.current = listeningAudioState.progress;
      return;
    }
    const wasProgress = lastListeningProgressRef.current;
    if (listeningAudioState.progress < 0.2 && wasProgress > 0.5) {
      setListeningAvatarSeed((prev) => prev + 1);
    }
    lastListeningProgressRef.current = listeningAudioState.progress;
  }, [mode, listeningAudioState.isPlaying, listeningAudioState.progress]);

  const readingHeroVideoSrc = narrationVideoUrl ?? loopVideoUrl;
  const readingSideVideoSrc = loopVideoUrl;
  const avatarVideoSrc = isAvatar3D
    ? isReading3D
      ? readingHeroVideoSrc
      : mode === 'listening-mode'
        ? listeningVideoUrl ?? loopVideoUrl
        : loopVideoUrl
    : undefined;
  const isDesktop = !isTabletOrBelow;
  const isAvatarIntroComplete = !isReading3D || isContentAudioComplete;
  const shouldLockChat = isReading3D && !isContentAudioComplete;
  const shouldShowReadingHero =
    isHeroMode3D && isDesktop && !isNarrationComplete;
  const shouldShowSideAvatar =
    isAvatar3D && (!isHeroMode3D || !isDesktop || isAvatarIntroComplete);
  const shouldShowListeningSidebar =
    isAvatar3D && mode === 'listening-mode' && listeningStage === 'quiz';
  const modeTitle =
    mode === 'photo-mode'
      ? 'Photo Mode'
      : mode === 'reading-mode'
        ? 'Reading Mode'
        : mode === 'roleplay-mode'
          ? 'Roleplay Mode'
          : mode === 'debate-mode'
            ? 'Debate Mode'
            : mode === 'curriculum-mode'
              ? 'Curriculum Mode'
              : 'Chat Mode';

  return (
    <div className="flex max-h-screen">
      <main className="flex-1 transition-all duration-300">
        <div className="mx-auto md:px-6">
          {isNarrowScreen && isAvatar3D && mode !== 'listening-mode' ? (
            <div className="flex flex-col gap-3 h-[calc(100vh-120px)] min-h-0">
              <div className="flex-none shrink-0">
                {isAvatar3D ? (
                  <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                    {(mode === 'reading-mode' || mode === 'roleplay-mode') && (
                      <AvatarHeaderBar
                        title={modeTitle}
                        onBack={() => navigate(-1)}
                        timerLabel={
                          sessionTimeRemaining !== null
                            ? formatTime(sessionTimeRemaining)
                            : '...'
                        }
                      />
                    )}
                    <AvatarModeLayout
                      compact
                      syncPlaying={isAvatarSyncPlaying}
                      videoSrc={avatarVideoSrc}
                      loop={isReading3D ? false : undefined}
                      onEnded={isReading3D ? handleNarrationComplete : undefined}
                      heightClassName={
                        mode === 'roleplay-mode' || mode === 'reading-mode'
                          ? 'h-auto'
                          : undefined
                      }
                      videoClassName={
                        mode === 'roleplay-mode' || mode === 'reading-mode'
                          ? 'w-full h-auto object-contain'
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <AvatarModeLayout
                    compact
                    syncPlaying={isAvatarSyncPlaying}
                    videoSrc={avatarVideoSrc}
                  />
                )}
              </div>
              <div className="flex-1 min-h-0">
                  <ChatWindow
                    onShowFeedback={handleShowFeedback}
                    onTopicImage={handleTopicImage}
                    onContentPayload={handleContentPayload}
                    onAudioPlaybackChange={handleAudioPlaybackChange}
                    onNarrationComplete={handleNarrationComplete}
                    readingHeroActive={shouldShowReadingHero}
                    isAvatar3D={isAvatar3D}
                    avatarVideoSrc={avatarVideoSrc}
                    chatLocked={shouldLockChat}
                    onContentAudioComplete={handleContentAudioComplete}
                    onListeningVideoUrl={handleListeningVideoUrl}
                    onSessionTimeRemaining={setSessionTimeRemaining}
                    onListeningAudioController={(controller) => {
                      listeningAudioControlRef.current = controller;
                    }}
                    onListeningAudioState={(state) => {
                      setListeningAudioState((prev) => {
                      if (
                        prev.isPlaying === state.isPlaying &&
                        prev.progress === state.progress &&
                        prev.duration === state.duration
                      ) {
                        return prev;
                      }
                      return state;
                    });
                  }}
                  onListeningStageChange={(stage, data) => {
                    setListeningStage(stage ?? null);
                    if (data?.kbAudioUrl) {
                      setListeningAudioUrl(data.kbAudioUrl);
                    }
                  }}
                />
              </div>
              <FeedbackSectionModal
                isOpen={isFeedbackMobile}
                onClose={() => setIsFeedbackMobile(false)}
                feedback={currentFeedback}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4 lg:gap-6">
              <div className="flex flex-col min-[768px]:flex-row justify-between w-full gap-4 lg:gap-6">
                <div
                  className={`flex-1 min-[768px]:flex-grow-2 w-full min-[768px]:w-auto flex flex-col min-h-0 ${
                    mode === 'roleplay-mode' ? 'order-1 min-[768px]:order-1' : 'order-2 min-[768px]:order-1'
                  }`}
                >
                  {!isNarrowScreen && isAvatar3D && mode === 'roleplay-mode' && (
                    <div className="w-full max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white mb-0">
                      <AvatarHeaderBar
                        title={modeTitle}
                        onBack={() => navigate(-1)}
                        timerLabel={
                          sessionTimeRemaining !== null
                            ? formatTime(sessionTimeRemaining)
                            : '...'
                        }
                      />
                    </div>
                  )}
                  {!isNarrowScreen &&
                    !isDesktop &&
                    isAvatar3D &&
                    mode === 'reading-mode' && (
                      <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white mb-0">
                        <AvatarHeaderBar
                          title={modeTitle}
                          onBack={() => navigate(-1)}
                        timerLabel={
                          sessionTimeRemaining !== null
                            ? formatTime(sessionTimeRemaining)
                            : '...'
                        }
                      />
                    </div>
                    )}
                  {isHeroMode3D && isDesktop && (
                    <div
                      className={`transition-all duration-700 ease-in-out overflow-hidden ${
                        shouldShowReadingHero
                          ? 'opacity-100 translate-y-0 scale-100 max-h-[1000px] mb-4'
                          : 'opacity-0 -translate-y-2 scale-95 max-h-0 mb-0 pointer-events-none'
                      }`}
                    >
                      <div className="w-full max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                        {isAvatar3D && (
                          <AvatarHeaderBar
                            title={modeTitle}
                            onBack={() => navigate(-1)}
                            timerLabel={
                              sessionTimeRemaining !== null
                                ? formatTime(sessionTimeRemaining)
                                : '...'
                            }
                          />
                        )}
                        <AvatarModeLayout
                          syncPlaying={isAvatarSyncPlaying}
                          videoSrc={readingHeroVideoSrc}
                          loop={false}
                          onEnded={handleNarrationComplete}
                          heightClassName="h-auto"
                          videoClassName="max-h-[300px] h-auto w-auto object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}
                  <ChatWindow
                    onShowFeedback={handleShowFeedback}
                    onTopicImage={handleTopicImage}
                    onContentPayload={handleContentPayload}
                    onAudioPlaybackChange={handleAudioPlaybackChange}
                    onNarrationComplete={handleNarrationComplete}
                    readingHeroActive={shouldShowReadingHero}
                    isAvatar3D={isAvatar3D}
                    avatarVideoSrc={avatarVideoSrc}
                    chatLocked={shouldLockChat}
                    onContentAudioComplete={handleContentAudioComplete}
                    onListeningVideoUrl={handleListeningVideoUrl}
                    onSessionTimeRemaining={setSessionTimeRemaining}
                    onListeningAudioController={(controller) => {
                      listeningAudioControlRef.current = controller;
                    }}
                    onListeningAudioState={(state) => {
                      setListeningAudioState(state);
                    }}
                    onListeningStageChange={(stage, data) => {
                      setListeningStage(stage ?? null);
                      if (data?.kbAudioUrl) {
                        setListeningAudioUrl(data.kbAudioUrl);
                      }
                    }}
                  />
                </div>
                <div
                  className={`flex flex-col gap-3 w-full min-[768px]:w-1/3 ${
                    mode === 'roleplay-mode' ? 'order-2 min-[768px]:order-2' : 'order-1 min-[768px]:order-2'
                  }`}
                >
                {isAvatar3D && mode !== 'listening-mode' && (
                  <div
                    className={`transition-all duration-700 ease-in-out ${
                      shouldShowSideAvatar
                        ? `opacity-100 translate-y-0 scale-100 ${
                            mode === 'roleplay-mode' || mode === 'reading-mode'
                              ? 'max-h-none overflow-visible'
                              : 'max-h-[420px] overflow-hidden'
                          }`
                        : 'opacity-0 translate-y-2 scale-95 max-h-0 pointer-events-none overflow-hidden'
                    }`}
                  >
                    <AvatarModeLayout
                      compact
                      syncPlaying={isAvatarSyncPlaying}
                      videoSrc={
                        isReading3D ? readingSideVideoSrc : avatarVideoSrc
                      }
                      heightClassName={
                        mode === 'roleplay-mode' || mode === 'reading-mode'
                          ? 'h-auto'
                          : undefined
                      }
                      videoClassName={
                        mode === 'roleplay-mode'
                          ? 'relative left-1/2 -translate-x-1/2 w-[150%] max-w-none h-auto object-contain object-center'
                          : mode === 'reading-mode'
                            ? 'w-full h-auto object-contain'
                            : undefined
                      }
                    />
                  </div>
                )}
                  {shouldShowListeningSidebar && (
                    <div className="flex flex-col gap-3">
                      <AvatarModeLayout
                        key={`listening-avatar-${listeningAvatarSeed}`}
                        compact
                        syncPlaying={listeningAudioState.isPlaying}
                        videoSrc={avatarVideoSrc}
                      />
                      <AudioPlayer
                        audioSrc={listeningAudioUrl || ''}
                        isPlaying={listeningAudioState.isPlaying}
                        progress={listeningAudioState.progress}
                        duration={listeningAudioState.duration}
                        onTogglePlay={() => {
                          if (listeningAudioState.isPlaying) {
                            listeningAudioControlRef.current?.pause?.();
                          } else {
                            listeningAudioControlRef.current?.play?.();
                          }
                        }}
                        showTotal
                      />
                    </div>
                  )}
                {!isSmallScreen && !(isAvatar3D && mode === 'listening-mode') && (
                  <FeedbackSection
                    isOpen={isFeedbackOpen}
                    onClose={() => setIsFeedbackOpen(false)}
                    feedback={currentFeedback}
                  />
                )}
                {isSmallScreen && !(isAvatar3D && mode === 'listening-mode') && (
                  <FeedbackSectionModal
                    isOpen={isFeedbackMobile}
                    onClose={() => setIsFeedbackMobile(false)}
                    feedback={currentFeedback}
                    />
                  )}
                  <div className="hidden md:block">
                    {mode === 'photo-mode' && (
                      <PhotoDisplay imageUrl={topicImage} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
