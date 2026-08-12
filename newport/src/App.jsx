import { useCallback, useState } from "react";
import WorksSection from "./components/WorksSection";
import ProfileSection from "./components/ProfileSection";
import TransitionScreen from "./components/TransitionScreen";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const [view, setView] = useState("works");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToProfile = useCallback(() => {
    setIsTransitioning(true);
    setView("profile");
  }, []);

  const goToWorks = useCallback(() => {
    setIsTransitioning(true);
    setView("works");
  }, []);

  const handleArrived = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <>
      <LoadingScreen />

      {view === "works" ? (
        <WorksSection onNavigateProfile={goToProfile} onArrived={handleArrived} />
      ) : (
        <ProfileSection onNavigateWorks={goToWorks} onArrived={handleArrived} />
      )}

      <TransitionScreen
        active={isTransitioning}
        label={view === "profile" ? "Cargando Perfil..." : "Cargando Works..."}
      />
    </>
  );
}

export default App;
