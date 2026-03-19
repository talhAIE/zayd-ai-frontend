import React from 'react';
import AvatarStage from './AvatarStage';

interface AvatarModeLayoutProps {
  compact?: boolean;
  syncPlaying?: boolean;
}

const AvatarModeLayout: React.FC<AvatarModeLayoutProps> = ({
  compact = false,
  syncPlaying = false,
}) => {

  return (
    <div className="w-full">
      <AvatarStage compact={compact} syncPlaying={syncPlaying} />
    </div>
  );
};

export default AvatarModeLayout;
