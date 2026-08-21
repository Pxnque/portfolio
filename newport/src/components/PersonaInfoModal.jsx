import { useEffect } from "react";
import "./WorksSection.css"; // reuses .work-modal / .work-modal__* styles

// Same modal chrome as WorkInfoModal (WORKS' INFO button), but with just
// a paragraph of text, no title/stack/VISIT button.
export default function PersonaInfoModal({
  text,
  accent = "#c084fc",
  onClose,
}) {
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
      style={{ "--accent": accent }}
      role="dialog"
      aria-modal="true"
      aria-label="Sobre mí"
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

        <p style={{ fontSize: 24 }} className="work-modal__description">
          {text}
        </p>
      </div>
    </div>
  );
}
