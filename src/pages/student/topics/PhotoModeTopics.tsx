import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTopics } from "@/redux/slices/topicsSlice";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoModePracticeContainer } from "@/components/student/photo-mode/PhotoModePracticeContainer";

export interface DemoTopicItem {
  id: string;
  topicName: string;
  subtitle: string;
  progressPercentage: number;
  isCompleted: boolean;
  attachmentUrl: string;
  unlocksAt?: string | null;
}

const PhotoModeTopics = () => {
  const dispatch = useAppDispatch();
  const [selectedTopic, setSelectedTopic] = useState<DemoTopicItem | null>(null);

  const { topics, isLoading, error } = useAppSelector((state) => state.topics);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTopics({ userId: user.id, topicMode: "photo-mode" }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const isTopicLocked = (topic: DemoTopicItem) => {
    if (user?.schoolCategory !== "government") {
      return false;
    }
    if (!topic.unlocksAt) {
      return false;
    }
    return new Date(topic.unlocksAt) > new Date();
  };

  const getUnlockCountdown = (unlocksAt: string) => {
    const unlockDate = new Date(unlocksAt);
    const now = new Date();
    const diffTime = unlockDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return "Unlocks today";
    }
    if (diffDays === 1) {
      return "Unlocks tomorrow";
    }
    return `Unlocks in ${diffDays} days`;
  };

  const displayTopics: DemoTopicItem[] = topics.map((topic) => ({
    id: topic.id,
    topicName: topic.topicName,
    subtitle: "10 images - 10 sentences",
    progressPercentage: topic.isCompleted ? 100 : 0,
    isCompleted: Boolean(topic.isCompleted),
    attachmentUrl: topic.attachmentUrl || "",
    unlocksAt: topic.unlocksAt,
  }));

  const sortedTopics = [...displayTopics].sort((a, b) => {
    if (user?.schoolCategory !== "government") {
      return 0;
    }

    const aLocked = isTopicLocked(a);
    const bLocked = isTopicLocked(b);

    const aDate = a.unlocksAt ? new Date(a.unlocksAt).getTime() : 0;
    const bDate = b.unlocksAt ? new Date(b.unlocksAt).getTime() : 0;

    if (aLocked && bLocked) {
      return aDate - bDate;
    }
    if (aLocked) {
      return 1;
    }
    if (bLocked) {
      return -1;
    }
    return 0;
  });

  const renderTopicCard = (topic: DemoTopicItem) => {
    const locked = isTopicLocked(topic);
    const unlockCountdown =
      locked && topic.unlocksAt ? getUnlockCountdown(topic.unlocksAt) : null;

    return (
      <div
        key={topic.id}
        className="flex flex-col justify-between p-4 gap-4 bg-white border border-[#E5E7EB] rounded-[20px] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md cursor-pointer"
        onClick={() => !locked && setSelectedTopic(topic)}
      >
        {/* Topic Image Cover */}
        <div className="relative w-full h-[130px] rounded-[12px] overflow-hidden bg-[#F0F4FA]">
          {topic.attachmentUrl ? (
            <img
              src={topic.attachmentUrl}
              alt={topic.topicName}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                locked ? "filter grayscale" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6E748F] text-sm font-semibold">
              Photo Mode
            </div>
          )}
          {locked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-2">
              <Lock className="w-6 h-6 mb-1 text-white/90" />
              <span className="text-center text-xs font-semibold text-white/90">
                {unlockCountdown}
              </span>
            </div>
          )}
        </div>

        {/* Topic Info */}
        <div className="flex flex-col gap-1">
          <h3 className="font-outfit font-bold text-[20px] leading-[25px] text-[#0F1450] line-clamp-1">
            {topic.topicName}
          </h3>
          <p className="font-outfit font-normal text-[14px] leading-[18px] text-[#6E748F]">
            {topic.subtitle}
          </p>
        </div>

        {/* Progress Row */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between items-center text-[12px] leading-[15px] font-outfit">
            <span className="font-semibold text-[#6E748F]">Topic Progress</span>
            <span className="font-bold text-[#06CCB5]">
              {topic.progressPercentage}%
            </span>
          </div>
          <div className="w-full h-[6px] bg-[#E5E7EB] rounded-[3px] overflow-hidden">
            <div
              className="h-full bg-[#06CCB5] rounded-[3px] transition-all duration-300"
              style={{ width: `${topic.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Start Practice Button */}
        <Button
          disabled={locked}
          onClick={(e) => {
            e.stopPropagation();
            if (!locked) setSelectedTopic(topic);
          }}
          className="w-full h-[39px] bg-[#06CCB5] hover:bg-[#05b8a3] text-white rounded-[12px] font-outfit font-bold text-[15px] leading-[19px] flex items-center justify-center gap-2 shadow-none disabled:opacity-60"
        >
          <span>{topic.isCompleted ? "Practice Again" : "Start Practice"}</span>
          <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
        </Button>
      </div>
    );
  };

  // If a topic is selected, render the Step 1 Narration practice screen matching photo-mode-step1-narration.css
  if (selectedTopic) {
    return (
      <PhotoModePracticeContainer
        topic={selectedTopic}
        restartOnStart={selectedTopic.isCompleted}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-8">
      {/* Header Group */}
      <div className="flex flex-col gap-2">
        <h1 className="font-outfit font-bold text-[28px] leading-[35px] text-[#0F1450]">
          Select a Topic
        </h1>
        <p className="font-outfit font-normal text-[15px] leading-[19px] text-[#6E748F]">
          3 new topics added weekly
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col p-4 gap-4 bg-white border border-[#E5E7EB] rounded-[20px]">
              <Skeleton className="h-[130px] w-full rounded-[12px]" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full rounded-[3px]" />
              <Skeleton className="h-[39px] w-full rounded-[12px]" />
            </div>
          ))}
        </div>
      ) : sortedTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {sortedTopics.map((topic) => renderTopicCard(topic))}
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 text-center text-[#6E748F] font-outfit">
          No Photo Mode topics available for this account.
        </div>
      )}
    </div>
  );
};

export default PhotoModeTopics;