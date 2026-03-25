import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FeedbackSection from './FeedbackSection';
import FeedbackSectionModal from './FeedbackSectionModel';
import PhotoDisplay from './PhotoDisplay';
import ChatWindow from './ChatWindow';
import AvatarModeLayout from '@/components/3d/AvatarModeLayout';

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

const Chat: React.FC = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(true);
  const [isFeedbackMobile, setIsFeedbackMobile] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [topicImage, setTopicImage] = useState<string | null>(null);
  const [isAvatarSyncPlaying, setIsAvatarSyncPlaying] = useState(false);
  const [narrationVideoUrl, setNarrationVideoUrl] = useState<string | null>(
    null,
  );
  const [isNarrationComplete, setIsNarrationComplete] = useState(false);
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

  const handleAudioPlaybackChange = useCallback(
    (isPlaying: boolean) => {
      setIsAvatarSyncPlaying(isPlaying);
    },
    [],
  );

  const handleNarrationComplete = useCallback(() => {
    setIsNarrationComplete(true);
  }, []);

  useEffect(() => {
    if (!isHeroMode3D) {
      setIsNarrationComplete(true);
      return;
    }
    setIsNarrationComplete(false);
  }, [isHeroMode3D, narrationVideoUrl]);

  const avatarVideoSrc = isAvatar3D
    ? isReading3D
      ? narrationVideoUrl ?? loopVideoUrl
      : loopVideoUrl
    : undefined;
  const isDesktop = !isTabletOrBelow;
  const shouldShowReadingHero =
    isHeroMode3D && isDesktop && !isNarrationComplete;
  const shouldShowSideAvatar =
    isAvatar3D && (!isHeroMode3D || !isDesktop || isNarrationComplete);

  return (
    <div className="flex max-h-screen">
      <main className="flex-1 transition-all duration-300">
        <div className="mx-auto md:px-6">
          {isNarrowScreen && isAvatar3D && mode !== 'listening-mode' ? (
            <div className="flex flex-col gap-1.5 h-[calc(100vh-120px)] min-h-0">
              <div className="flex-[0.55] min-h-0">
                <AvatarModeLayout
                  compact
                  syncPlaying={isAvatarSyncPlaying}
                  videoSrc={avatarVideoSrc}
                />
              </div>
              <div className="flex-[0.45] min-h-0">
                <ChatWindow
                  onShowFeedback={handleShowFeedback}
                  onTopicImage={handleTopicImage}
                  onContentPayload={handleContentPayload}
                  onAudioPlaybackChange={handleAudioPlaybackChange}
                />
              </div>
              <FeedbackSectionModal
                isOpen={isFeedbackMobile}
                onClose={() => setIsFeedbackMobile(false)}
                feedback={currentFeedback}
              />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-6">
              <div className="flex-1 md:flex-grow-2 w-full md:w-auto flex flex-col min-h-0">
                {isHeroMode3D && isDesktop && (
                  <div
                    className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      shouldShowReadingHero
                        ? 'opacity-100 translate-y-0 scale-100 max-h-[1000px] mb-4'
                        : 'opacity-0 -translate-y-2 scale-95 max-h-0 mb-0 pointer-events-none'
                    }`}
                  >
                    <div className="w-full max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                      <AvatarModeLayout
                        syncPlaying={isAvatarSyncPlaying}
                        videoSrc={avatarVideoSrc}
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
                />
              </div>
              <div className="flex flex-col gap-3 w-full md:w-1/3">
                {isAvatar3D && mode !== 'listening-mode' && (
                  <div
                    className={`transition-all duration-700 ease-in-out overflow-hidden ${
                      shouldShowSideAvatar
                        ? 'opacity-100 translate-y-0 scale-100 max-h-[420px]'
                        : 'opacity-0 translate-y-2 scale-95 max-h-0 pointer-events-none'
                    }`}
                  >
                    <AvatarModeLayout
                      compact
                      syncPlaying={isAvatarSyncPlaying}
                      videoSrc={avatarVideoSrc}
                    />
                  </div>
                )}
                {!isSmallScreen && (
                  <FeedbackSection
                    isOpen={isFeedbackOpen}
                    onClose={() => setIsFeedbackOpen(false)}
                    feedback={currentFeedback}
                  />
                )}
                {isSmallScreen && (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
