import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import chatModeAvatar from "@/assets/svgs/chat-mode.png";
import photoModeAvatar from "@/assets/svgs/photo-mode.png";
import debateModeAvatar from "@/assets/svgs/debate-mode.png";
import roleplayModeAvatar from "@/assets/svgs/roleplay-mode.png";
import listeningModeAvatar from "@/assets/svgs/listening-mode.png";
import ReadingModeAvatar from "@/assets/svgs/reading-mode.png";
import curriculumModeAvatar from "@/assets/svgs/curriculum-mode.webp";
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

  const user = localStorage.getItem("AiTutorUser");
  const parsedUser = JSON.parse(user || "{}");
  const schoolCategory = parsedUser?.schoolCategory;

  let filteredModes = modes;
  if (schoolCategory === "government") {
    filteredModes = modes.filter(
      (mode) =>
        mode.title === "Reading Mode" ||
        mode.title === "Role Play Mode" ||
        mode.title === "Listening Mode" ||
        mode.title === "Debate Mode" ||
        mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "trial") {
    filteredModes = modes.filter(
      (mode) =>
        mode.title === "Reading Mode" ||
        mode.title === "Role Play Mode" ||
        mode.title === "Listening Mode" ||
        mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "saudi") {
    filteredModes = modes.filter(
      (mode) =>
        mode.title === "Reading Mode" ||
        mode.title === "Role Play Mode" ||
        mode.title === "Listening Mode" ||
        mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "american") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Chat Mode" || mode.title === "Photo Mode" ||
        mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "american-2025") {
    filteredModes = modes.filter(
      (mode) =>
        mode.title === "Reading Mode" ||
        mode.title === "Role Play Mode" ||
        mode.title === "Listening Mode" ||
        mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "demo-flow") {
    filteredModes = modes.filter(
      (mode) => mode.title === "Reading Mode" || mode.title === "Role Play Mode" || mode.title === "Listening Mode" || mode.title === "Curriculum Mode"
    );
  }

  if (schoolCategory === "Bave AI")
    filteredModes = modes.filter(
      (mode) =>
        mode.title === "Chat Mode" ||
        mode.title === "Photo Mode" ||
        mode.title === "Debate Mode" ||
        mode.title === "Reading Mode" ||
        mode.title === "Role Play Mode" ||
        mode.title === "Listening Mode" ||
        mode.title === "Curriculum Mode"
    );

  // const [isQueationnaireOpen, setIsQuestionnaireOpen] = React.useState(true);

  const handleStartButton = (route: string) => {
    console.log("Start button clicked");
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
          {filteredModes.map((mode, index) => (
            <div
              key={index}
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
    </>
  );
};

export default LearningModes;
