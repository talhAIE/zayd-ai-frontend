import { useState, useRef } from 'react';
import { Play, Pause, FileText } from 'lucide-react';
import { LearningComponent } from '@/services/learningService';

interface MediaComponentProps {
  component: LearningComponent;
}

export default function MediaComponent({ component }: MediaComponentProps) {
  const content = component.content || {};
  const mediaType = content.mediaType || (content.url?.endsWith('.mp3') ? 'audio' : 'image');
  const url = content.url || '';
  const caption = content.caption || component.description;
  const transcript = content.transcript;
  const altText = content.altText || component.title;

  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8 flex flex-col gap-4 font-['Outfit',sans-serif]">
      <h3 className="text-[18px] font-bold text-[#0F172A]">
        {component.title}
      </h3>

      {mediaType === 'image' && url && (
        <div className="rounded-[16px] overflow-hidden border border-[#E2E8F0] bg-gray-50 max-h-[400px] flex items-center justify-center">
          <img src={url} alt={altText} className="w-full h-auto object-cover max-h-[380px]" />
        </div>
      )}

      {mediaType === 'audio' && url && (
        <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-3">
          <audio
            ref={audioRef}
            src={url}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[#4F8DFB] hover:bg-[#3B82F6] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex flex-col">
                <span className="font-bold text-[14px] text-[#0F172A]">Audio Listening Sample</span>
                <span className="text-[12px] text-[#64748B]">{isPlaying ? 'Playing...' : 'Click to listen'}</span>
              </div>
            </div>
            {transcript && (
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-[12px] font-bold text-[#4F8DFB] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{showTranscript ? 'Hide Transcript' : 'Show Transcript'}</span>
              </button>
            )}
          </div>
          {transcript && showTranscript && (
            <div className="p-3 bg-white rounded-[10px] border border-gray-200 text-[13px] text-[#475569] leading-relaxed animate-in fade-in">
              <span className="font-bold text-[#0F172A] block mb-1">Transcript:</span>
              {transcript}
            </div>
          )}
        </div>
      )}

      {caption && (
        <p className="text-[13px] text-[#64748B] italic">
          {caption}
        </p>
      )}
    </div>
  );
}
