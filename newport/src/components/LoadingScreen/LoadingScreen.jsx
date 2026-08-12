import React, { useState } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  const { progress } = useProgress();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

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

            {progress < 100 ? (
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
