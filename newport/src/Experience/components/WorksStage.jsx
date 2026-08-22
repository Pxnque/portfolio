import { useCallback, useEffect, useRef, useState } from "react";
import WorkFrame from "./WorkFrame";

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
      current.map((entry) => ({ ...entry, phase: "exiting", direction })),
    );
  }, [work, direction]);

  const handleExited = useCallback((id) => {
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
