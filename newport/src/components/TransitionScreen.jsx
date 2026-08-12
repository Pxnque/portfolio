import "./TransitionScreen.css";

// Reuses the boot LoadingScreen's "SYSTEM dialogue" visual language, but
// with its own fast, reusable CSS: this one toggles on every WORKS <->
// Perfil navigation, so it can't afford the boot screen's ~1.5s cinematic
// reveal timing.
export default function TransitionScreen({ active, label = "Cargando..." }) {
  return (
    <div
      className={`nav-transition${active ? " is-active" : ""}`}
      style={{ pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
    >
      <div className="nav-transition__backdrop" />
      <div className="nav-transition__box">
        <div className="nav-transition__tab">
          <span>SYSTEM</span>
        </div>
        <div className="nav-transition__content">
          <span className="nav-transition__spinner" aria-hidden="true" />
          <p className="nav-transition__label">{label}</p>
        </div>
      </div>
    </div>
  );
}
