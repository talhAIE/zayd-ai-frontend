
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface AudioPlayerProps {
    audioSrc: string;
    isPlaying: boolean;
    progress: number;
    duration: number;
    onTogglePlay: () => void;
}

const formatTime = (sec: number) => {
    if (isNaN(sec) || sec === Infinity) {
        return '00:00';
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
                className={`w-[3px] rounded-full ${i < coloredBars ? 'bg-primary' : 'bg-gray-300'
                    }`}
                style={{ height: `${heights[i % heights.length]}px` }}
            />
        ));
    }, [barCount, progress, duration]);

    return (
        <div className="flex items-center gap-2 w-full max-w-xs p-2 rounded-full bg-gray-100 border">
            <Button
                size="icon"
                className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-md h-8 w-8 flex-shrink-0"
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
            <span className="text-xs font-mono text-gray-500 min-w-[45px] text-right pr-1">
                {formatTime(progress)}
            </span>
        </div>
    );
};

export default AudioPlayer; 