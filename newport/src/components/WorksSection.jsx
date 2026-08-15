import { useCallback, useEffect, useState } from "react";
import WorksExperience from "../Experience/WorksExperience";
import WorkInfoModal from "./WorkInfoModal";
import { worksData } from "../Experience/utils/worksData";
import "./WorksSection.css";

export default function WorksSection({ onNavigateProfile }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [infoOpen, setInfoOpen] = useState(false);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % worksData.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + worksData.length) % worksData.length);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    setInfoOpen(false);
  }, [index]);

  const active = worksData[index];

  return (
    <section id="works" className="works-section">
      <div className="works-canvas">
        <WorksExperience
          work={active}
          direction={direction}
          onInfoClick={() => setInfoOpen(true)}
        />
      </div>

      <div className="works-ui">
        <div className="works-pill-group">
          <button
            type="button"
            className="works-pill works-pill--profile"
            onClick={onNavigateProfile}
          >
            PROFILE
          </button>
          <span className="works-pill">WORKS</span>
        </div>

        <div className="works-counter">
          <span className="works-counter__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="works-counter__title">{active.title}</span>
        </div>

        <div className="works-nav">
          <button
            type="button"
            className="works-arrow"
            onClick={goPrev}
            aria-label="Trabajo anterior"
          >
            ‹
          </button>
          <span className="works-nav__label">Ant. / Sig.</span>
          <button
            type="button"
            className="works-arrow"
            onClick={goNext}
            aria-label="Siguiente trabajo"
          >
            ›
          </button>
        </div>

        <div className="works-ticks">
          {worksData.map((work, i) => (
            <button
              key={work.id}
              type="button"
              className={`works-tick${i === index ? " is-active" : ""}`}
              style={{ "--accent": work.accent }}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Ir a ${work.title}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      {infoOpen && (
        <WorkInfoModal work={active} onClose={() => setInfoOpen(false)} />
      )}
    </section>
  );
}
