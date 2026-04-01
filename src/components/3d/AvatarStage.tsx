import React, { useRef } from 'react';

interface AvatarStageProps {
  timerLabel?: string;
  videoSrc?: string;
  compact?: boolean;
  syncPlaying?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  heightClassName?: string;
  videoClassName?: string;
}

const AvatarStage: React.FC<AvatarStageProps> = ({
  timerLabel,
  videoSrc = '/avatar/placeholder.mp4',
  compact = false,
  syncPlaying = false,
  loop,
  onEnded,
  heightClassName,
  videoClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (syncPlaying) {
      video.loop = loop ?? true;
      video.play().catch(() => {});
    } else {
      video.loop = loop ?? false;
      video.pause();
    }
  }, [syncPlaying, loop]);

  const videoSizingClass =
    videoClassName ?? 'w-full h-full object-cover';

  return (
    <div className="w-full">
      {timerLabel && (
        <div className="mb-2 inline-flex rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-xs font-semibold text-sky-700">
          {timerLabel}
        </div>
      )}
      <div className="w-full max-w-full mx-auto">
        <div
          className={`w-full rounded-2xl overflow-hidden ${
            heightClassName ?? (compact ? 'h-[360px]' : 'h-[440px]')
          }`}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            muted
            preload="auto"
            onEnded={onEnded}
            className={`relative block -scale-x-100 ${videoSizingClass}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarStage;
