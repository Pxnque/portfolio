import { useCallback, useEffect, useRef, useState } from "react";
import WorkFrame from "./WorkFrame";

// Runs the card change sequentially: the outgoing card fully fades/slides
// out first, and only once it's gone does the incoming one fade/slide in.
// Keeping only one WorkFrame mounted at a time is what prevents the two
// cards (mesh + Html overlay) from ever overlapping mid-transition.
//
// `direction` (1 = next, -1 = prev) is captured per entry at the moment its
// transition starts, so a later click doesn't retroactively change which
// way an already-animating card slides.
export default function WorksStage({ work, direction = 1, onInfoClick }) {
  const nextInstanceId = useRef(0);
  const [entries, setEntries] = useState(() => [
    { id: nextInstanceId.current++, work, phase: "entering", direction },
  ]);
  const currentIdRef = useRef(work.id);
  const pendingWorkRef = useRef(null);
  const pendingDirectionRef = useRef(1);

  useEffect(() => {
    if (work.id === currentIdRef.current) return;
    currentIdRef.current = work.id;
    pendingWorkRef.current = work;
    pendingDirectionRef.current = direction;
    setEntries((current) =>
      current.map((entry) => ({ ...entry, phase: "exiting", direction }))
    );
  }, [work, direction]);

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
    const nextDirection = pendingDirectionRef.current;
    setEntries((current) => [
      ...current,
      {
        id: nextInstanceId.current++,
        work: nextWork,
        phase: "entering",
        direction: nextDirection,
      },
    ]);
  }, []);

  return (
    <>
      {entries.map((entry) => (
        <WorkFrame
          key={entry.id}
          work={entry.work}
          phase={entry.phase}
          direction={entry.direction}
          onExited={() => handleExited(entry.id)}
          onInfoClick={onInfoClick}
        />
      ))}
    </>
  );
}
