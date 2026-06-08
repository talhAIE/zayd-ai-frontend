import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import chatModeAvatar from "@/assets/svgs/chat-mode.png";
import photoModeAvatar from "@/assets/svgs/photo-mode.png";
import debateModeAvatar from "@/assets/svgs/debate-mode.png";
import roleplayModeAvatar from "@/assets/svgs/roleplay-mode.png";
import listeningModeAvatar from "@/assets/svgs/listening-mode.png";
import ReadingModeAvatar from "@/assets/svgs/reading-mode.png";
import curriculumModeAvatar from "@/assets/svgs/curriculum-mode.webp";
import TopicService from "@/services/topicsService";
import InteractiveTour, { TourStep } from "@/components/ui/InteractiveTour";

import mode3dImg from "@/assets/user-guide/learning-mode/3d.png";
import chatImg from "@/assets/user-guide/learning-mode/chat.png";
import curriculumImg from "@/assets/user-guide/learning-mode/curriculum.png";
import debateImg from "@/assets/user-guide/learning-mode/debate.png";
import listeningImg from "@/assets/user-guide/learning-mode/listening.png";
import photoImg from "@/assets/user-guide/learning-mode/photo.png";
import readingImg from "@/assets/user-guide/learning-mode/reading.png";
import roleplayImg from "@/assets/user-guide/learning-mode/roleplay.png";

// import QuestionnaireModal from "@/components/ui/QuestionaireModal";

const ALL_TOUR_STEPS: Record<string, Omit<TourStep, "targetId">> = {
  "Reading Mode": {
    title: "Reading Mode",
    description: "This is reading mode! You do all the heavy lifting here.",
    position: "bottom",
    image: readingImg,
  },
  "Role Play Mode": {
    title: "Roleplay Mode",
    description: "Jump into exciting adventures and play fun roles with the AI.",
    position: "bottom",
    image: roleplayImg,
  },
  "Listening Mode": {
    title: "Listening Mode",
    description: "Listen to stories and practice saying words with the AI.",
    position: "bottom",
    image: listeningImg,
  },
  "3D Avatar Mode": {
    title: "3D Avatar Mode",
    description: "3D avatar learning with Reading, Role Play, and Listening.",
    position: "bottom",
    image: mode3dImg,
  },
  "Curriculum Mode": {
    title: "Curriculum Mode",
    description: "Structured learning with chapters and topics.",
    position: "bottom",
    image: curriculumImg,
  },
  "Chat Mode": {
    title: "Chat Mode",
    description: "Enhance your language skills by chatting with our AI.",
    position: "bottom",
    image: chatImg,
  },
  "Photo Mode": {
    title: "Photo Mode",
    description: "Let's break down images and get instant feedback from AI.",
    position: "bottom",
    image: photoImg,
  },
  "Debate Mode": {
    title: "Debate Mode",
    description: "Practice debating skills and critical thinking with the AI.",
    position: "bottom",
    image: debateImg,
  },
};

const modes = [
  {
    title: "Chat Mode",
    description: "Enhance your language skills by chatting with our AI.",
    image: chatModeAvatar,
    route: "/student/learning-modes/chat-mode",
  },
  {
    title: "Photo Mode",
    description: "Let's break down images and get instant feedback from AI.",
    image: photoModeAvatar,
    route: "/student/learning-modes/photo-mode",
  },
  {
    title: "Reading Mode",
    description:
      "Let's read through fun stories and practice saying words with the AI.",
    image: ReadingModeAvatar,
    route: "/student/learning-modes/reading-mode",
  },
  {
    title: "Role Play Mode",
    description:
      "Jump into exciting adventures and play fun roles with the AI.",
    image: roleplayModeAvatar,
    route: "/student/learning-modes/roleplay-mode",
  },
  {
    title: "Listening Mode",
    description: "Listen to stories and practice saying words with the AI.",
    image: listeningModeAvatar,
    route: "/student/learning-modes/listening-mode",
  },
  {
    title: "3D Avatar Mode",
    description: "3D avatar learning with Reading, Role Play, and Listening.",
    image: ReadingModeAvatar,
    route: "/student/learning-modes/3d-avatar-mode",
  },
  {
    title: "Debate Mode",
    description: "Practice debating skills and critical thinking with the AI.",
    image: debateModeAvatar,
    route: "/student/learning-modes/debate-mode",
  },
  {
    title: "Curriculum Mode",
    description: "Structured learning with chapters and topics.",
    image: curriculumModeAvatar,
    route: "/student/learning-modes/curriculum-mode",
  },
];

const LearningModes: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tourActive, setTourActive] = React.useState(searchParams.get("tour") === "true");

  React.useEffect(() => {
    if (tourActive) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("tour");
      setSearchParams(newParams, { replace: true });
    }
  }, [tourActive, searchParams, setSearchParams]);

  const user = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(user || "{}");
  const schoolCategory = parsedUser?.schoolCategory;
  const schoolName = parsedUser?.schoolName;
  const userId = parsedUser?.id;
  const cachedTopicModes = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("availableTopicModes");
      return raw ? (JSON.parse(raw) as string[]) : null;
    } catch {
      return null;
    }
  }, []);

  const filteredModes = React.useMemo(() => {
    let nextModes = modes;
    if (schoolCategory === "government") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode" ||
          mode.title === "Debate Mode"
      );
    }

    if (schoolCategory === "trial") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode"
      );
    }

    if (schoolCategory === "saudi") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode"
      );
    }

    if (schoolCategory === "american") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Chat Mode" ||
          mode.title === "Photo Mode" ||
          mode.title === "Curriculum Mode"
      );
    }

    if (schoolCategory === "american-2025") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode" ||
          mode.title === "Curriculum Mode"
      );
    }

    if (schoolCategory === "demo-flow") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode" ||
          mode.title === "3D Avatar Mode"
      );
    }

    if (schoolCategory === "Bave AI") {
      nextModes = modes.filter(
        (mode) =>
          mode.title === "Chat Mode" ||
          mode.title === "Photo Mode" ||
          mode.title === "Debate Mode" ||
          mode.title === "Reading Mode" ||
          mode.title === "Role Play Mode" ||
          mode.title === "Listening Mode" ||
          mode.title === "3D Avatar Mode"
      );
    }

    const is3dAllowed =
      schoolCategory?.toLowerCase?.() === "3d-demo-test" ||
      schoolName?.toLowerCase?.() === "3d-demo-test";
    if (!is3dAllowed) {
      nextModes = nextModes.filter((mode) => mode.title !== "3D Avatar Mode");
    }

    return nextModes;
  }, [schoolCategory, schoolName]);

  const [modeAvailability, setModeAvailability] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    let cancelled = false;

    const topicModeByTitle: Record<string, string> = {
      "Chat Mode": "chat-mode",
      "Photo Mode": "photo-mode",
      "Reading Mode": "reading-mode",
      "Role Play Mode": "roleplay-mode",
      "Listening Mode": "listening-mode",
      "Debate Mode": "debate-mode",
      "Curriculum Mode": "curriculum-mode",
    };

    const fetchAvailability = async () => {
      if (!userId) return;

      try {
        // Fetch all mode availability in a single API call
        const response = await TopicService.getAvailableModes(userId);
        const modesData = response?.data?.data?.modes;

        if (modesData) {
          const modeMap: Record<string, boolean> = {};
          modesData.forEach((m: any) => {
            modeMap[m.topicMode] = m.isAvailable;
            if (m.children) {
              m.children.forEach((child: any) => {
                modeMap[child.topicMode] = child.isAvailable;
              });
            }
          });

          const newAvailability: Record<string, boolean> = {};
          filteredModes.forEach((mode) => {
            if (mode.title === "3D Avatar Mode") {
              newAvailability[mode.title] = modeMap["3d-avatar-mode"] ?? false;
            } else {
              const topicMode = topicModeByTitle[mode.title];
              if (!topicMode) {
                newAvailability[mode.title] = true;
              } else {
                newAvailability[mode.title] = modeMap[topicMode] ?? false;
              }
            }
          });

          if (!cancelled) {
            setModeAvailability(newAvailability);
          }
          return;
        }
      } catch (error) {
        console.error("Failed to fetch available modes", error);
      }

      // Fallback to cache if API fails or returns no data
      if (cachedTopicModes) {
        const cachedSet = new Set(cachedTopicModes);
        const fallbackAvailability: Record<string, boolean> = {};
        
        filteredModes.forEach((mode) => {
          if (mode.title === "3D Avatar Mode") {
            fallbackAvailability[mode.title] =
              cachedSet.has("3d-reading-mode") ||
              cachedSet.has("3d-roleplay-mode") ||
              cachedSet.has("3d-listening-mode");
          } else {
            const topicMode = topicModeByTitle[mode.title];
            if (!topicMode) {
              fallbackAvailability[mode.title] = true;
            } else {
              fallbackAvailability[mode.title] = cachedSet.has(topicMode);
            }
          }
        });
        
        if (!cancelled) {
          setModeAvailability(fallbackAvailability);
        }
      }
    };

    fetchAvailability();
    return () => {
      cancelled = true;
    };
  }, [userId, filteredModes, cachedTopicModes]);

  // const [isQueationnaireOpen, setIsQuestionnaireOpen] = React.useState(true);

  const handleStartButton = (route: string) => {
    console.log("Start button clicked");
    navigate(route);
  };

  const activeModes = React.useMemo(() => {
    return filteredModes.filter((mode) => modeAvailability[mode.title] !== false);
  }, [filteredModes, modeAvailability]);

  const tourSteps: TourStep[] = React.useMemo(() => {
    return activeModes.map((mode) => {
      const stepData = ALL_TOUR_STEPS[mode.title];
      return {
        targetId: `tour-${mode.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: stepData?.title || mode.title,
        description: stepData?.description || "",
        position: "bottom" as const,
        image: stepData?.image,
        onNextAction:
          mode.title === "Chat Mode"
            ? () => {
                navigate(`${mode.route}?tour=true`);
              }
            : undefined,
      };
    });
  }, [activeModes, navigate]);

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
          {activeModes.map((mode, index) => (
            <div
              key={index}
              id={`tour-${mode.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 rounded-3xl p-4 sm:p-3 bg-gradient-to-br from-[#058cf432] to-[#8a83f02c] hover:shadow-lg transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-blue-100 flex items-center justify-center">
                <img
                  src={mode.image}
                  alt={`${mode.title} avatar`}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                />
              </div>

              {/* Title and Description */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {mode.title}
                </h2>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </div>

              {/* Gradient Start Button */}
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

        {/* <QuestionnaireModal
        open={isQueationnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
      /> */}
      </div>

      <InteractiveTour
        active={tourActive}
        steps={tourSteps}
        onComplete={() => setTourActive(false)}
        onSkip={() => setTourActive(false)}
      />
    </>
  );
};

export default LearningModes;
