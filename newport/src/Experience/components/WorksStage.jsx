import { useCallback, useEffect, useRef, useState } from "react";
import WorkFrame from "./WorkFrame";

// Keeps the outgoing and incoming WorkFrame mounted at the same time so
// they can crossfade, instead of swapping instantly on index change.
export default function WorksStage({ work, onInfoClick }) {
  const nextInstanceId = useRef(0);
  const [entries, setEntries] = useState(() => [
    { id: nextInstanceId.current++, work, phase: "entering" },
  ]);
  const currentIdRef = useRef(work.id);

  useEffect(() => {
    if (work.id === currentIdRef.current) return;
    currentIdRef.current = work.id;
    setEntries((current) => [
      ...current.map((entry) => ({ ...entry, phase: "exiting" })),
      { id: nextInstanceId.current++, work, phase: "entering" },
    ]);
  }, [work]);

  const handleExited = useCallback((id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
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
