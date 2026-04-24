import React from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarHeaderBarProps {
  title: string;
  timerLabel: string;
  onBack: () => void;
}

const AvatarHeaderBar: React.FC<AvatarHeaderBarProps> = ({
  title,
  timerLabel,
  onBack,
}) => {
  return (
    <header className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 md:px-6 py-4 border-b bg-white">
      <Button variant="ghost" size="icon" onClick={onBack} className="justify-self-start">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="min-w-0 truncate text-center text-base md:text-lg font-semibold">
        {title}
      </h2>
      <div className="justify-self-end flex items-center gap-2 whitespace-nowrap text-sm px-3 py-1.5 rounded-lg border-2 border-[#3EA4F9] bg-white text-gray-500">
        <Clock className="h-5 w-5 text-[#3EA4F9]" />
        <span>{timerLabel}</span>
      </div>
    </header>
  );
};

export default AvatarHeaderBar;
