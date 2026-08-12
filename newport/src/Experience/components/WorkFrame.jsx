import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export const FRAME_WIDTH = 4.8;
export const FRAME_HEIGHT = 3;

function shade(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + percent);
  const g = clamp(((num >> 8) & 0xff) + percent);
  const b = clamp((num & 0xff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

function CoverImage({ src }) {
  const texture = useTexture(src);
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

function CoverPlaceholder({ accent }) {
  return <meshBasicMaterial color={shade(accent, -95)} toneMapped={false} />;
}

function Cover({ work }) {
  return work.image ? (
    <CoverImage src={work.image} />
  ) : (
    <CoverPlaceholder accent={work.accent} />
  );
}

export default function WorkFrame({ work, direction = 1 }) {
  const groupRef = useRef(null);
  const progress = useRef(0);
  const [showInfo, setShowInfo] = useState(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 2.2);
    const eased = 1 - Math.pow(1 - progress.current, 3);
    group.position.x = THREE.MathUtils.lerp(direction * 1.6, 0, eased);
    group.position.y = THREE.MathUtils.lerp(-0.2, 0, eased);
    const s = THREE.MathUtils.lerp(0.92, 1, eased);
    group.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[FRAME_WIDTH + 0.08, FRAME_HEIGHT + 0.08]} />
        <meshBasicMaterial color={work.accent} toneMapped={false} />
      </mesh>

      <mesh>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <Cover work={work} />
      </mesh>

      <Html center occlude={false} position={[0, 0, 0.05]} zIndexRange={[10, 0]}>
        <div className="work-card" style={{ "--accent": work.accent }}>
          <span className="work-card__bracket work-card__bracket--tl" />
          <span className="work-card__bracket work-card__bracket--tr" />
          <span className="work-card__bracket work-card__bracket--bl" />
          <span className="work-card__bracket work-card__bracket--br" />

          {work.tag && <span className="work-card__tag">{work.tag}</span>}

          <div className="work-card__bottom">
            <p className="work-card__category">{work.category}</p>
            <h3 className="work-card__title">{work.title}</h3>

            <div className="work-card__actions">
              <button
                type="button"
                className={`work-btn${showInfo ? " is-active" : ""}`}
                onClick={() => setShowInfo((v) => !v)}
                aria-expanded={showInfo}
              >
                INFO
              </button>
              <a
                className="work-btn work-btn--visit"
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                VISIT
              </a>
            </div>

            {showInfo && (
              <p className="work-card__description">{work.description}</p>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
