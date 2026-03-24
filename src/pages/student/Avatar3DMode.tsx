import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import roleplayModeAvatar from "@/assets/svgs/roleplay-mode.png";
import listeningModeAvatar from "@/assets/svgs/listening-mode.png";
import ReadingModeAvatar from "@/assets/svgs/reading-mode.png";

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
          {modes.map((mode, index) => (
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
