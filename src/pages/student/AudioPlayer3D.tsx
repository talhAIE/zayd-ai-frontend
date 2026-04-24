
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  showTotal?: boolean;
}

const formatTime = (sec: number, placeholder = '00:00') => {
  if (isNaN(sec) || sec === Infinity) {
    return placeholder;
  }
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(
    Math.floor(sec % 60)
  ).padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  showTotal = false,
}) => {
  const waveformRef = React.useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = React.useState(0);

  React.useLayoutEffect(() => {
    const container = waveformRef.current;
    if (!container) return;

    const barWidth = 3;
    const gap = 2;
    const totalBarSpace = barWidth + gap;

    const updateBarCount = () => {
      const width = container.offsetWidth;
      setBarCount(Math.floor(width / totalBarSpace));
    };

    updateBarCount();

    const resizeObserver = new ResizeObserver(updateBarCount);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const bars = React.useMemo(() => {
    const heights = [
      4, 8, 12, 16, 20, 16, 12, 8, 4, 8, 12, 16, 20, 24, 20, 16, 12, 8,
      12, 16, 20, 16, 12, 8, 4,
    ];
    const progressPercentage = duration > 0 ? (progress / duration) : 0;
    const coloredBars = Math.floor(progressPercentage * barCount);

    return Array.from({ length: barCount }, (_, i) => (
      <div
        key={i}
        className={`w-[3px] rounded-full ${i < coloredBars ? 'bg-[#6AAEFF]' : 'bg-white/20'
          }`}
        style={{ height: `${heights[i % heights.length]}px` }}
      />
    ));
  }, [barCount, progress, duration]);

  return (
    <div className="flex items-center gap-3 w-full rounded-full bg-[#2B2B2B] px-3 py-2 shadow-lg">
      <Button
        size="icon"
        className="rounded-full bg-white/10 text-white hover:bg-white/20 shadow-md h-8 w-8 flex-shrink-0"
        onClick={onTogglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div
        ref={waveformRef}
        className="flex h-6 w-full items-center gap-[2px] overflow-hidden"
      >
        {bars}
      </div>
      <span className="text-xs font-mono text-white/80 min-w-[92px] text-right pr-1 whitespace-nowrap">
        {showTotal
          ? `${formatTime(progress)} / ${formatTime(duration, '--:--')}`
          : formatTime(progress)}
      </span>
    </div>
  );
};

export default AudioPlayer; 