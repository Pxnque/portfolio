import { useEffect, useState } from "react";
import "./LoadingScreen/LoadingScreen.css";
import "./TransitionScreen.css";

const ENTER_MS = 400;
const HOLD_MS = 100;

export default function TransitionScreen({ trigger, onCovered }) {
  const [phase, setPhase] = useState("idle"); // idle | entering | held | leaving

  useEffect(() => {
    if (trigger === 0) return;

    setPhase("entering");

    const coveredTimer = setTimeout(() => {
      onCovered?.();
      setPhase("held");
    }, ENTER_MS);

    const leaveTimer = setTimeout(() => {
      setPhase("leaving");
    }, ENTER_MS + HOLD_MS);

    return () => {
      clearTimeout(coveredTimer);
      clearTimeout(leaveTimer);
    };
  }, [trigger]);

  const isCovering = phase === "entering" || phase === "held";
  const rectClass =
    phase === "entering" ? "entering" : phase === "held" ? "" : "revealed";

  return (
    <div
      className="loading-screen"
      style={{ pointerEvents: isCovering ? "auto" : "none" }}
    >
      <div className={`background-rectangle-accent ${rectClass}`} />
      <div className={`background-rectangle ${rectClass}`} />
    </div>
  );
}
