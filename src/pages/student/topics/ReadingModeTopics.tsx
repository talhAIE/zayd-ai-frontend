import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTopics } from "@/redux/slices/topicsSlice";
import { Calendar, Lock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ReadingModeTopics = () => {
  const dispatch = useAppDispatch();

  const { topics, isLoading, error } = useAppSelector((state) => state.topics);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTopics({ userId: user.id, topicMode: "reading-mode" }));
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

  // Group topics by weeks for trial users
  const groupTopicsByWeeks = (topics: any[]) => {
    if (user?.schoolCategory !== "trial") {
      return { default: topics };
    }

    const topicsWithDates = topics.filter((topic) => topic.unlocksAt);

    if (topicsWithDates.length === 0) {
      return { default: topics };
    }

    // Find the earliest date
    const earliestDate = new Date(
      Math.min(
        ...topicsWithDates.map((topic) => new Date(topic.unlocksAt).getTime())
      )
    );

    const weekGroups: { [key: string]: any[] } = {};

    topics.forEach((topic) => {
      if (!topic.unlocksAt) {
        // Topics without dates go to default group
        if (!weekGroups.default) weekGroups.default = [];
        weekGroups.default.push(topic);
        return;
      }

      const topicDate = new Date(topic.unlocksAt);
      const daysDiff = Math.floor(
        (topicDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNumber = Math.floor(daysDiff / 7) + 1;
      const weekKey = `week${weekNumber}`;

      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(topic);
    });

    return weekGroups;
  };

  const weekGroups = groupTopicsByWeeks(sortedTopics);

  const renderTopicCard = (topic: any) => {
    const locked = isTopicLocked(topic);
    const unlockCountdown =
      locked && topic.unlocksAt ? getUnlockCountdown(topic.unlocksAt) : null;

    return (
      <Card key={topic.id} className="overflow-hidden flex flex-col">
        <div className="aspect-video w-full relative overflow-hidden">
          <img
            src={topic.attachmentUrl}
            alt={topic.topicName}
            className={`absolute inset-0 w-full h-full object-cover ${
              locked ? "filter grayscale" : ""
            }`}
          />
          {locked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
              <Lock className="w-8 h-8 mb-2" />
              <span className="text-center font-semibold">
                {unlockCountdown}
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex-grow p-4">
          <h3 className="font-medium text-base">{topic.topicName}</h3>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          {topic.isCompleted ? (
            <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
              Incomplete
            </span>
          )}
          <Link
            to={`/student/learning-mode/${topic?.id}/${encodeURIComponent(
              topic.topicName
            )}?mode=reading-mode`}
            className={locked ? "pointer-events-none" : ""}
          >
            <Button size="sm" disabled={locked}>
              Start
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  const renderComingSoonCard = () => {
    return (
      <Card key="coming-soon-week2" className="overflow-hidden flex flex-col">
        <div className="aspect-video w-full relative overflow-hidden">
          <img
            src={topics[0]?.attachmentUrl || "/api/placeholder/400/200"}
            alt="Week 2 Coming Soon"
            className="absolute inset-0 w-full h-full object-cover filter grayscale"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white p-4">
            <Lock className="w-8 h-8 mb-2" />
            <span className="text-center font-semibold text-lg">
              Coming Soon
            </span>
          </div>
        </div>

        <CardContent className="flex-grow p-4">
          <h3 className="font-medium text-base">Week 2 Topics</h3>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
            Locked
          </span>
          <Button size="sm" disabled>
            Start
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="mx-auto px-4 py-6">
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
        <div>
          {user?.schoolCategory === "trial" ? (
            // Week-based layout for trial users
            Object.entries(weekGroups)
              .sort(([a], [b]) => {
                // Sort by week number, default group goes last
                if (a === "default") return 1;
                if (b === "default") return -1;
                const weekA = parseInt(a.replace("week", ""));
                const weekB = parseInt(b.replace("week", ""));
                return weekA - weekB;
              })
              .map(([weekKey, weekTopics]) => {
                const weekNumber = weekKey.replace("week", "");
                const isDefaultGroup = weekKey === "default";

                return (
                  <div key={weekKey} className="mb-8">
                    {!isDefaultGroup && (
                      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                        <Calendar className="w-5 h-5" />
                        Week {weekNumber}
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {weekTopics.length > 0 ? (
                        weekTopics.map((topic: any) => renderTopicCard(topic))
                      ) : (
                        <div className="col-span-full text-center py-10">
                          <p className="text-muted-foreground">
                            No topics available
                          </p>
                        </div>
                      )}
                      {/* Add Coming Soon card for Week 2 */}
                      {weekKey === "week2" && renderComingSoonCard()}
                    </div>
                  </div>
                );
              })
              // Ensure Week 2 appears even if no topics exist for it
              .concat(
                !Object.keys(weekGroups).includes("week2") ? (
                  <div key="week2" className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      Week 2
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {renderComingSoonCard()}
                    </div>
                  </div>
                ) : []
              )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedTopics.length > 0 ? (
                sortedTopics.map((topic: any) => {
                  const locked = isTopicLocked(topic);
                  const unlockCountdown =
                    locked && topic.unlocksAt
                      ? getUnlockCountdown(topic.unlocksAt)
                      : null;

                  return (
                    <Card
                      key={topic.id}
                      className="overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video w-full relative overflow-hidden">
                        <img
                          src={topic.attachmentUrl}
                          alt={topic.topicName}
                          className={`absolute inset-0 w-full h-full object-cover ${
                            locked ? "filter grayscale" : ""
                          }`}
                        />
                        {locked && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
                            <Lock className="w-8 h-8 mb-2" />
                            <span className="text-center font-semibold">
                              {unlockCountdown}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="flex-grow p-4">
                        <h3 className="font-medium text-base">
                          {topic.topicName}
                        </h3>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between">
                        {topic.isCompleted ? (
                          <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
                            Incomplete
                          </span>
                        )}
                        <Link
                          to={`/student/learning-mode/${
                            topic?.id
                          }/${encodeURIComponent(
                            topic.topicName
                          )}?mode=reading-mode`}
                          className={locked ? "pointer-events-none" : ""}
                        >
                          <Button size="sm" disabled={locked}>
                            Start
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No topics available</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingModeTopics;
