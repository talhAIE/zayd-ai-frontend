import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import roleplayModeAvatar from "@/assets/svgs/roleplay-mode.png";
import listeningModeAvatar from "@/assets/svgs/listening-mode.png";
import ReadingModeAvatar from "@/assets/svgs/reading-mode.png";
import TopicService from "@/services/topicsService";

const modes = [
  {
    title: "3D Reading",
    description: "Reading mode with 3D avatar playback.",
    image: ReadingModeAvatar,
    route: "/student/learning-modes/3d-avatar-mode/reading-mode",
  },
  {
    title: "3D Role Play",
    description: "Role play mode with 3D avatar playback.",
    image: roleplayModeAvatar,
    route: "/student/learning-modes/3d-avatar-mode/roleplay-mode",
  },
  {
    title: "3D Listening",
    description: "Listening mode with 3D avatar playback.",
    image: listeningModeAvatar,
    route: "/student/learning-modes/3d-avatar-mode/listening-mode",
  },
];

const Avatar3DMode: React.FC = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(user || "{}");
  const userId = parsedUser?.id;
  const cachedTopicModes = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("availableTopicModes");
      return raw ? (JSON.parse(raw) as string[]) : null;
    } catch {
      return null;
    }
  }, []);

  const [modeAvailability, setModeAvailability] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    let cancelled = false;

    const topicModeByTitle: Record<string, string> = {
      "3D Reading": "3d-reading-mode",
      "3D Role Play": "3d-roleplay-mode",
      "3D Listening": "3d-listening-mode",
    };

    const hasContentForMode = async (topicMode: string) => {
      try {
        const response = await TopicService.getTopics(userId, topicMode);
        const payload = response?.data?.data;
        if (!payload) return true;
        if (payload.isChapterBased) {
          return (payload.chapters?.length || 0) > 0;
        }
        return (payload.topics?.length || 0) > 0;
      } catch {
        return true;
      }
    };

    const fetchAvailability = async () => {
      if (!userId) return;
      if (cachedTopicModes) {
        const cachedSet = new Set(cachedTopicModes);
        const results = modes.map((mode) => {
          const topicMode = topicModeByTitle[mode.title];
          if (!topicMode) {
            return [mode.title, true] as const;
          }
          return [mode.title, cachedSet.has(topicMode)] as const;
        });

        if (!cancelled) {
          setModeAvailability(
            results.reduce((acc, [title, available]) => {
              acc[title] = available;
              return acc;
            }, {} as Record<string, boolean>)
          );
        }
        return;
      }
      const results = await Promise.all(
        modes.map(async (mode) => {
          const topicMode = topicModeByTitle[mode.title];
          if (!topicMode) {
            return [mode.title, true] as const;
          }
          const available = await hasContentForMode(topicMode);
          return [mode.title, available] as const;
        })
      );

      if (!cancelled) {
        setModeAvailability(
          results.reduce((acc, [title, available]) => {
            acc[title] = available;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [userId, cachedTopicModes]);

  const handleStartButton = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <style>{`
        .gradient-hover-animate {
          background: linear-gradient(to right, #3EA4F9 0%, #0267B5 50%, #3EA4F9 100%);
          background-size: 200% 100%;
          background-position: 0% 50%;
          transition: background-position 0.6s ease;
        }
        .gradient-hover-animate:hover {
          background-position: 100% 50%;
        }
      `}</style>
      <div className="mt-6 lg:mt-4 mx-2">
        <div className="flex flex-col gap-6 mx-auto">
          {modes
            .filter((mode) => modeAvailability[mode.title] !== false)
            .map((mode, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 rounded-3xl p-4 sm:p-3 bg-gradient-to-br from-[#058cf432] to-[#8a83f02c] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-blue-100 flex items-center justify-center">
                <img
                  src={mode.image}
                  alt={`${mode.title} avatar`}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {mode.title}
                </h2>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto me-0 sm:me-6">
                <Button
                  className="gradient-hover-animate w-full sm:w-auto text-white font-semibold px-6 sm:px-24 py-4 sm:py-6 rounded-xl shadow-md"
                  onClick={() => handleStartButton(mode.route)}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Avatar3DMode;
