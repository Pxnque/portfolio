import { useCallback, useEffect, useRef, useState } from "react";
import WorkFrame from "./WorkFrame";

// Runs the card change sequentially: the outgoing card fully fades/slides
// out first, and only once it's gone does the incoming one fade/slide in.
// Keeping only one WorkFrame mounted at a time is what prevents the two
// cards (mesh + Html overlay) from ever overlapping mid-transition.
export default function WorksStage({ work, onInfoClick }) {
  const nextInstanceId = useRef(0);
  const [entries, setEntries] = useState(() => [
    { id: nextInstanceId.current++, work, phase: "entering" },
  ]);
  const currentIdRef = useRef(work.id);
  const pendingWorkRef = useRef(null);

  useEffect(() => {
    if (work.id === currentIdRef.current) return;
    currentIdRef.current = work.id;
    pendingWorkRef.current = work;
    setEntries((current) =>
      current.map((entry) => ({ ...entry, phase: "exiting" }))
    );
  }, [work]);

  const handleExited = useCallback((id) => {
    // Read/clear the pending ref here, outside the updater: React 18 Strict
    // Mode calls updater functions twice to check purity, and mutating a
    // ref inside one made the two calls take different branches, so the
    // second call always saw pendingWorkRef already cleared and dropped
    // the incoming card.
    setEntries((current) => current.filter((entry) => entry.id !== id));

    const nextWork = pendingWorkRef.current;
    if (!nextWork) return;
    pendingWorkRef.current = null;
    setEntries((current) => [
      ...current,
      { id: nextInstanceId.current++, work: nextWork, phase: "entering" },
    ]);
  }, []);

  return (
    <>
      {entries.map((entry) => (
        <WorkFrame
          key={entry.id}
          work={entry.work}
          phase={entry.phase}
          onExited={() => handleExited(entry.id)}
          onInfoClick={onInfoClick}
        />
      ))}
    </>
  );
}
