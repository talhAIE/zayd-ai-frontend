import React, { useRef } from 'react';
import zaydMascot from '@/assets/images/landingpage/zaydMascot.svg';

interface AvatarStageProps {
  timerLabel?: string;
  videoSrc?: string;
  compact?: boolean;
  syncPlaying?: boolean;
}

const AvatarStage: React.FC<AvatarStageProps> = ({
  timerLabel,
  videoSrc = '/avatar/placeholder.mp4',
  compact = false,
  syncPlaying = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnded = () => {};

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (syncPlaying) {
      videoRef.current.loop = true;
      videoRef.current.play();
    } else {
      videoRef.current.loop = false;
      videoRef.current.pause();
    }
  }, [syncPlaying]);

  return (
    <div className="w-full">
      {timerLabel && (
        <div className="mb-2 inline-flex rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-xs font-semibold text-sky-700">
          {timerLabel}
        </div>
      )}
      <div className="w-full max-w-full mx-auto">
        <div className="w-full rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={zaydMascot}
            playsInline
            muted
            preload="auto"
            onEnded={handleEnded}
            className={`relative block w-full h-auto object-contain -scale-x-100 ${compact ? 'max-h-[300px]' : 'max-h-[380px]'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarStage;
