import { useCallback, useRef, useState } from "react";
import WorksSection from "./components/WorksSection";
import ProfileSection from "./components/ProfileSection";
import TransitionScreen from "./components/TransitionScreen";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function App() {
  const [view, setView] = useState("profile");
  const [navRequestId, setNavRequestId] = useState(0);
  const [bootReady, setBootReady] = useState(false);
  const pendingViewRef = useRef(null);

  const requestNavigate = useCallback(
    (nextView) => {
      if (!bootReady) return;
      pendingViewRef.current = nextView;
      setNavRequestId((n) => n + 1);
    },
    [bootReady],
  );

  const goToProfile = useCallback(
    () => requestNavigate("profile"),
    [requestNavigate],
  );
  const goToWorks = useCallback(
    () => requestNavigate("works"),
    [requestNavigate],
  );

  const handleCovered = useCallback(() => {
    if (!pendingViewRef.current) return;
    setView(pendingViewRef.current);
    pendingViewRef.current = null;
  }, []);

  return (
    <>
      <LoadingScreen onDismissed={() => setBootReady(true)} />

      {view === "works" ? (
        <WorksSection onNavigateProfile={goToProfile} />
      ) : (
        <ProfileSection onNavigateWorks={goToWorks} />
      )}

      <TransitionScreen trigger={navRequestId} onCovered={handleCovered} />
    </>
  );
}

export default App;
