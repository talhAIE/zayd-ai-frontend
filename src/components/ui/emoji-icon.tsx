import React from 'react';

interface EmojiIconProps {
  emoji: string;
  fallback?: React.ReactNode;
  className?: string;
  size?: number;
}

export default function EmojiIcon({ emoji, className = "", size = 24 }: EmojiIconProps) {
  return (
    <span 
      className={`emoji-icon ${className}`}
      style={{ 
        fontSize: `${size}px`
      }}
    >
      {emoji}
    </span>
  );
}
