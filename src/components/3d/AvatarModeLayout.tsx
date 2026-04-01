import React from 'react';
import AvatarStage from './AvatarStage';

interface AvatarModeLayoutProps {
  compact?: boolean;
  syncPlaying?: boolean;
  videoSrc?: string;
  loop?: boolean;
  onEnded?: () => void;
  heightClassName?: string;
  videoClassName?: string;
}

const AvatarModeLayout: React.FC<AvatarModeLayoutProps> = ({
  compact = false,
  syncPlaying = false,
  videoSrc,
  loop,
  onEnded,
  heightClassName,
  videoClassName,
}) => {

  return (
    <div className="w-full">
      <AvatarStage
        compact={compact}
        syncPlaying={syncPlaying}
        videoSrc={videoSrc}
        loop={loop}
        onEnded={onEnded}
        heightClassName={heightClassName}
        videoClassName={videoClassName}
      />
    </div>
  );
};

export default AvatarModeLayout;
