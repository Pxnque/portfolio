import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

// useProgress only moves once something actually loads through Three's
// loading manager (useTexture, useGLTF, etc). With no real assets in the
// scene yet, `active` never turns true and `progress` stays frozen at 0,
// so the screen never leaves "Cargando recursos...". These two timers
// cover that: if nothing starts loading shortly after mount, treat it as
// already loaded; if something starts but stalls, a longer safety timeout
// still lets the user through.
const NO_ASSETS_GRACE_MS = 500;
const SAFETY_TIMEOUT_MS = 15000;

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (active) hasStartedRef.current = true;
  }, [active]);

  useEffect(() => {
    const graceTimer = setTimeout(() => {
      if (!hasStartedRef.current) setForceReady(true);
    }, NO_ASSETS_GRACE_MS);
    const safetyTimer = setTimeout(() => setForceReady(true), SAFETY_TIMEOUT_MS);

    return () => {
      clearTimeout(graceTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const isLoading = !forceReady && progress < 100;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleAnimationFinished = () => {
    setIsAnimationFinished(true);
  };

  if (isAnimationFinished) {
    return null;
  }

  return (
    <>
      <div className="loading-screen">
        <div
          className={`background-rectangle-accent ${isRevealed ? "revealed" : ""}`}
        ></div>
        <div
          className={`background-rectangle ${isRevealed ? "revealed" : ""}`}
          onTransitionEnd={handleAnimationFinished}
        ></div>

        <div className="loading-screen-info-container">
          <div
            className={`dialogue-box2 ${isRevealed ? "revealed" : ""}`}
          ></div>
          <div className={`dialogue-box ${isRevealed ? "revealed" : ""}`}>
            <div className="dialogue-tab">
              <span className="dialogue-label">SYSTEM</span>
            </div>

            {isLoading ? (
              <div className="dialogue-content">
                <div
                  className={`instruction-container ${isRevealed ? "revealed" : ""}`}
                >
                  Cargando recursos...
                </div>
                <div className="loading-bar-container">
                  <div
                    className="loading-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div className="percentage">{Math.round(progress)}%</div>
                </div>
              </div>
            ) : !isRevealed ? (
              <div className="dialogue-content">
                <div
                  className={`instruction-container ${isRevealed ? "revealed" : ""}`}
                >
                  Usa el scroll/Touch para avanzar
                </div>
                <div className="reveal-button">
                  <button onClick={handleReveal}>INICIAR</button>
                </div>
              </div>
            ) : null}

            <div className="continue-triangle"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
