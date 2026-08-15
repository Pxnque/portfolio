import { useEffect, useState } from "react";
import "./LoadingScreen/LoadingScreen.css";
import "./TransitionScreen.css";

const ENTER_MS = 700;
const HOLD_MS = 200;

// A self-contained "video game loading screen" sweep, independent of
// LoadingScreen: covers the viewport, holds for a beat (that's when the
// caller should swap the actual view behind it, via onCovered), then
// reveals using the same .revealed exit LoadingScreen already had.
//
// `trigger` must start at 0 and only ever be bumped by a real navigation
// request (App.jsx guarantees this: it won't touch it until the boot
// LoadingScreen has been dismissed). Gating on `trigger === 0` rather than
// a "first run" ref is deliberate: a ref-based guard breaks under React 18
// Strict Mode, which invokes this effect twice on mount — the first call
// would flip the ref, and the second would then sail past the early
// return and fire the whole sequence unprompted.
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
    // Only `trigger` should restart the sequence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
