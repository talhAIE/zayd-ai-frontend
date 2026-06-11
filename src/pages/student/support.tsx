import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserGuideWelcome from "@/components/ui/UserGuideWelcome";
import TourWelcomeModal from "@/components/ui/TourWelcomeModal";

export default function Support() {
  const navigate = useNavigate();
  const [welcomeModalActive, setWelcomeModalActive] = useState(false);

  const handleLaunchClick = () => {
    setWelcomeModalActive(true);
  };

  const handleStartTour = () => {
    setWelcomeModalActive(false);
    navigate("/student/dashboard?tour=true");
  };

  const handleSkipWelcome = () => {
    setWelcomeModalActive(false);
    navigate("/student/dashboard");
  };

  return (
    <>
      <UserGuideWelcome
        onLaunchTour={handleLaunchClick}
        onSkipTour={() => navigate("/student/dashboard")}
      />
      
      <TourWelcomeModal
        isOpen={welcomeModalActive}
        onStart={handleStartTour}
        onSkip={handleSkipWelcome}
      />
    </>
  );
}

