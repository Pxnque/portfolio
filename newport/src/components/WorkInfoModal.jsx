import { useEffect } from "react";

export default function WorkInfoModal({ work, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="work-modal"
      style={{ "--accent": work.accent }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-modal-title"
    >
      <div className="work-modal__backdrop" onClick={onClose} />

      <div className="work-modal__content">
        <button
          type="button"
          className="work-modal__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &#x2715;
        </button>

        <h1 id="work-modal-title" className="work-modal__title">
          {work.title}
        </h1>

        {work.stack?.length ? (
          <p className="work-modal__stack">{work.stack.join(" · ")}</p>
        ) : null}

        <p className="work-modal__description">{work.description}</p>

        <div className="work-modal__actions">
          <a
            className="work-btn work-btn--visit"
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            VISIT
          </a>
        </div>
      </div>
    </div>
  );
}
