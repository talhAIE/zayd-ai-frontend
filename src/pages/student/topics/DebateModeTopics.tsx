import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchTopics } from '@/redux/slices/topicsSlice';
import { Lock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DebateModeTopics = () => {
  const dispatch = useAppDispatch();

  const { topics, isLoading, error } = useAppSelector((state:any) => state.topics);
  const { user } = useAppSelector((state:any) => state.auth);

  useEffect(() => {
    if (user?.id) {
      console.log('Fetching debate mode topics for user:', user.id);
      dispatch(fetchTopics({ userId: user.id, topicMode: 'debate-mode' }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const isTopicLocked = (topic: any) => {
    if (user?.schoolCategory !== 'government') {
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
    if (user?.schoolCategory !== 'government') {
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

  return (
    <div className="mx-auto px-4 py-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTopics.length > 0 ? (
            sortedTopics.map((topic: any) => {
              const locked = isTopicLocked(topic);
              const unlockCountdown = locked ? getUnlockCountdown(topic.unlocksAt) : null;
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
                  <CardContent className=" flex-grow p-4">
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
                      to={`/student/learning-mode/${
                        topic?.id
                      }/${encodeURIComponent(topic.topicName)}?mode=debate-mode`}
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
  );
};

export default DebateModeTopics;
