import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TopicService from "@/services/topicsService";
import { Chapter } from "@/types/chapter.types";

const CurriculumModeTopics: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(user || "{}");
  const userId = parsedUser?.id;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await TopicService.getTopics(
          userId,
          "curriculum-mode",
        );
        // Check if response contains chapters
        if (response.data.data.isChapterBased && response.data.data.chapters) {
          setChapters(response.data.data.chapters);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        toast.error("Failed to load chapters");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchChapters();
    }
  }, [userId]);

  const handleChapterClick = (chapter: Chapter) => {
    navigate(`/student/learning-modes/curriculum-mode/chapter/${chapter.id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
      <div className="mx-auto px-4 py-6">
        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Card
                key={chapter.id}
                className="flex flex-col rounded-[1.75rem] border border-gray-100 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleChapterClick(chapter)}
              >
                {chapter.attachmentUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-[1.75rem]">
                    <img
                      src={chapter.attachmentUrl}
                      alt={chapter.name}
                      className="h-full w-full object-cover transition-transform duration-300 scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {chapter.name}
                  </h3>
                </div>
                <div className="px-6 pb-6 mt-auto">
                  <button className="gradient-hover-animate w-full text-white font-semibold px-6 py-3 rounded-xl shadow-md">
                    View Topics
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No chapters available</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CurriculumModeTopics;
