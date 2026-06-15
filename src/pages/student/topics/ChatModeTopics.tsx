import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTopics } from "@/redux/slices/topicsSlice";
import { Lock } from "lucide-react";
// import { logout } from '@/redux/slices/authSlice';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import InteractiveTour, { TourStep } from "@/components/ui/InteractiveTour";
const ChatModeTopics = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTourMode] = useState(searchParams.get("tour") === "true");
  const [tourActive, setTourActive] = useState(searchParams.get("tour") === "true");

  useEffect(() => {
    if (tourActive) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("tour");
      setSearchParams(newParams, { replace: true });
    }
  }, [tourActive, searchParams, setSearchParams]);

  const { topics, isLoading, error } = useAppSelector(
    (state: any) => state.topics
  );
  const { user } = useAppSelector((state: any) => state.auth);

  console.log("topics", topics);

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching chat mode topics for user:", user.id);
      dispatch(fetchTopics({ userId: user.id, topicMode: "chat-mode" }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const isTopicLocked = (topic: any) => {
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

  const sortedTopics = [...topics].sort((a, b) => {
    if (user?.schoolCategory !== "government") {
      return 0;
    }

    const aLocked = isTopicLocked(a);
    const bLocked = isTopicLocked(b);

    const aDate = a.unlocksAt ? new Date(a.unlocksAt).getTime() : 0;
    const bDate = b.unlocksAt ? new Date(b.unlocksAt).getTime() : 0;

    if (aLocked && bLocked) {
      return aDate - bDate; // both locked, sort by date
    }
    if (aLocked) {
      return 1; // a is locked, b is not, so b comes first
    }
    if (bLocked) {
      return -1; // b is locked, a is not, so a comes first
    }
    return 0; // both unlocked
  });

  const tourSteps: TourStep[] = useMemo(() => [
    {
      title: "💬 Chat with AI!",
      description: "This is a dedicated chat panel to help you understand your lessons in a greater depth!",
      buttonText: "Start Chatting",
      targetId: "tour-chat-container",
    },
    {
      title: "💬 Choose Your Topic",
      description: "Pick any topic to start a freestyle conversation with AI! Tap Start on any topic to begin.",
      buttonText: "Start Chatting",
      targetId: "tour-topic-grid",
      onNextAction: () => {
        const firstTopic = sortedTopics.find(t => !isTopicLocked(t));
        if (firstTopic) {
          navigate(`/student/learning-mode/${firstTopic.id}/${encodeURIComponent(firstTopic.topicName)}?mode=chat-mode&tour=true`);
        } else {
          setTourActive(false);
        }
      }
    },
  ], [sortedTopics, navigate]);

  const renderTopicCard = (topic: any) => {
    const locked = isTopicLocked(topic);
    const unlockCountdown =
      locked && topic.unlocksAt ? getUnlockCountdown(topic.unlocksAt) : null;

    const statusLabel = locked
      ? "Locked"
      : topic.isCompleted
      ? "Completed"
      : "Incomplete";

    const statusClasses = topic.isCompleted ? "text-[#2DCD6B]" : "text-white";

    return (
      <Card
        key={topic.id}
        className="flex flex-col rounded-[1.75rem] border border-gray-100 bg-white shadow-sm"
      >
        <div className="relative mx-4 mt-4 rounded-[1.5rem] overflow-hidden aspect-[1.2/1]">
          <img
            src={topic.attachmentUrl}
            alt={topic.topicName}
            className={`h-full w-full object-cover transition duration-300 ${
              locked ? "filter grayscale" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
          <span
            className={`absolute top-3 left-3 rounded-xl px-3 py-3 text-xs font-semibold backdrop-blur-[19.2px] bg-[#00000057] ${statusClasses}`}
          >
            {statusLabel}
          </span>
          <Link
            to={`/student/learning-mode/${topic?.id}/${encodeURIComponent(
              topic.topicName
            )}?mode=chat-mode${isTourMode ? '&tour=true' : ''}`}
            className={`absolute bottom-3 right-3 ${
              locked ? "pointer-events-none" : ""
            }`}
          >
            <Button
              size="sm"
              disabled={locked}
              className="gradient-hover-animate rounded-xl px-8 py-[1.2rem] text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:brightness-110 disabled:opacity-60 disabled:shadow-none"
            >
              Start
            </Button>
          </Link>
          {locked && (
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-4">
              <Lock className="w-8 h-8 mb-2" />
              <span className="text-center font-semibold">
                {unlockCountdown}
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex-grow px-5 py-4">
          <h3 className="font-semibold text-base text-gray-900 leading-snug">
            {topic.topicName}
          </h3>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <style>
        {`
          .gradient-hover-animate {
            background: linear-gradient(to right, #3EA4F9 0%, #0267B5 50%, #3EA4F9 100%);
            background-size: 200% 100%;
            background-position: 0% 50%;
            transition: background-position 0.6s ease;
          }
          .gradient-hover-animate:hover {
            background-position: 100% 50%;
          }
        `}
      </style>
      <div id="tour-chat-container" className="mx-auto px-4 py-6">
        {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Chat Modes</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleLogout}
          className="rounded-full"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div> */}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Skeleton className="h-10 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div id="tour-topic-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTopics.length > 0 ? (
              sortedTopics.map((topic: any) => renderTopicCard(topic))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No topics available</p>
              </div>
            )}
          </div>
        )}
      </div>

      <InteractiveTour
        active={tourActive}
        steps={tourSteps}
        onComplete={() => setTourActive(false)}
        onSkip={() => setTourActive(false)}
        variant="modal"
      />
    </>
  );
};

export default ChatModeTopics;
