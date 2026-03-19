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
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'chat-mode';
  const variant = searchParams.get('variant') || 'default';
  const isReading3D = mode === 'reading-mode' || variant === '3d';

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const smallQuery = window.matchMedia('(max-width: 640px)');
    const narrowQuery = window.matchMedia('(max-width: 768px)');

    const update = () => {
      setIsSmallScreen(smallQuery.matches);
      setIsNarrowScreen(narrowQuery.matches);
    };

    update();
    smallQuery.addEventListener?.('change', update);
    narrowQuery.addEventListener?.('change', update);

    return () => {
      smallQuery.removeEventListener?.('change', update);
      narrowQuery.removeEventListener?.('change', update);
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


  return (
    <div className="flex max-h-screen">
      <main className="flex-1 transition-all duration-300">
        <div className="mx-auto md:px-6">
          {isNarrowScreen && isReading3D ? (
            <div className="flex flex-col gap-1.5 h-[calc(100vh-120px)] min-h-0">
              <div className="flex-[0.55] min-h-0">
                <AvatarModeLayout
                  compact
                  syncPlaying={isAvatarSyncPlaying}
                />
              </div>
              <div className="flex-[0.45] min-h-0">
                <ChatWindow
                  onShowFeedback={handleShowFeedback}
                  onTopicImage={handleTopicImage}
                  onContentPayload={() => {}}
                  onAudioPlaybackChange={setIsAvatarSyncPlaying}
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
              <div className="flex-1 md:flex-grow-2 w-full md:w-auto ">
                <ChatWindow
                  onShowFeedback={handleShowFeedback}
                  onTopicImage={handleTopicImage}
                  onContentPayload={() => {}}
                  onAudioPlaybackChange={setIsAvatarSyncPlaying}
                />
              </div>
              <div className="flex flex-col gap-3 w-full md:w-1/3">
                {isReading3D && (
                  <AvatarModeLayout
                    compact
                    syncPlaying={isAvatarSyncPlaying}
                  />
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
