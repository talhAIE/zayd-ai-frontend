import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import chatModeAvatar from "@/assets/svgs/chatModeAvatar.svg";
import photoModeAvatar from "@/assets/svgs/photoModeAvatar.svg";
import debateModeAvatar from "@/assets/svgs/debateModeAvatar.svg";
import roleplayModeAvatar from "@/assets/svgs/roleplayModeAvatar.svg";
import listeningModeAvatar from "@/assets/svgs/listening-mode.png";
import ReadingModeAvatar from "@/assets/svgs/reading-mode.png";
// import QuestionnaireModal from "@/components/ui/QuestionaireModal";

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
    description: "Let's read through fun stories and practice saying words with the AI.",
    image: ReadingModeAvatar,
    route: "/student/learning-modes/reading-mode",
  },
  {
    title: "Role Play Mode",
    description: "Jump into exciting adventures and play fun roles with the AI.",
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
    title: "Debate Mode",
    description: "Practice debating skills and critical thinking with the AI.",
    image: debateModeAvatar,
    route: "/student/learning-modes/debate-mode",
  },
  {
    title: "Listening Mode",
    description: "Listen to stories and practice saying words with the AI.",
    image: listeningModeAvatar,
    route: "/student/learning-modes/listening-mode",
  },
  {
    title: "Debate Mode",
    description: "Practice debating skills and critical thinking with the AI.",
    image: debateModeAvatar,
    route: "/student/learning-modes/debate-mode",
  },
];

const LearningModes: React.FC = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(user || "{}");
  const schoolCategory = parsedUser?.schoolCategory;

  let filteredModes = modes;
  if (schoolCategory === "government") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Reading Mode" || mode.title === "Role Play Mode" || mode.title === "Listening Mode" || mode.title === "Debate Mode"
    );
  }

  if (schoolCategory === "trial") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Reading Mode" || mode.title === "Role Play Mode" || mode.title === "Listening Mode"
    );
  }

  if (schoolCategory === "saudi") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Reading Mode" || mode.title === "Role Play Mode" || mode.title === "Listening Mode"
    );
  }

  if (schoolCategory === "american") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Chat Mode" || mode.title === "Photo Mode"
    );
  }

  // const [isQueationnaireOpen, setIsQuestionnaireOpen] = React.useState(true);

  const handleStartButton = (route: string) => {
    console.log("Start button clicked");
    navigate(route);
  };

  return (
    <div className="mt-6 lg:mt-4 mx-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModes.map((mode, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row  border border-gray-150 rounded-3xl p-4 bg-white hover:shadow-md transition-shadow duration-300"
          >
            {/* Top row for mobile/tablet/small screens */}
            <div className="flex w-full items-center justify-between mb-4 lg:hidden">
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={mode.image}
                  alt={`${mode.title} avatar`}
                  className="w-16 h-16 object-contain"
                />
                <h2 className="text-lg font-bold text-[var(--font-dark)]">{mode.title}</h2>
              </div>
              <Button
                className="text-[var(--font-dark)] font-bold bg-[var(--cardbg)] hover:bg-[var(--cardbg)] active:bg-[var(--cardbg)] focus:bg-[var(--cardbg)] rounded-full"
                onClick={() => handleStartButton(mode.route)}
              >
                Start
              </Button>
            </div>

            {/* Description below on mobile/tablet */}
            <p className="text-sm text-[var(--font-light2)] mb-4 lg:hidden text-left">
              {mode.description}
            </p>

            {/* Large screen layout */}
            <div className="hidden lg:flex font-sans flex-1 mb-6 lg:mb-0 lg:mr-6 flex-col">
              <h2 className="text-xl font-bold text-[var(--font-dark)] mb-4">{mode.title}</h2>
              <p className="text-sm text-[var(--font-light2)] mb-4">{mode.description}</p>
              <Button
                className="text-[var(--font-dark)] font-bold bg-[var(--cardbg)] hover:bg-[var(--cardbg)] active:bg-[var(--cardbg)] focus:bg-[var(--cardbg)] rounded-full ml-2 mt-2 lg:w-16 w-full"
                onClick={() => handleStartButton(mode.route)}
              >
                Start
              </Button>

            </div>

            {/* Image on large screens */}
            <div className="hidden lg:flex w-40 h-40 flex-shrink-0 items-center justify-center">
              <img
                src={mode.image}
                alt={`${mode.title} avatar`}
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>


        ))}
      </div>

      {/* <QuestionnaireModal
        open={isQueationnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
      /> */}
    </div>
  );
};

export default LearningModes;
