import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

export const FRAME_WIDTH = 5.4;
export const FRAME_HEIGHT = 2.7;

const ENTER_OFFSET = 1.3;
const EXIT_OFFSET = 2.2;
const ANIM_SPEED = 2.4;

function shade(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + percent);
  const g = clamp(((num >> 8) & 0xff) + percent);
  const b = clamp((num & 0xff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

function CoverImage({ src, materialRef }) {
  const texture = useTexture(src);
  return (
    <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} transparent />
  );
}

function CoverPlaceholder({ accent, materialRef }) {
  return (
    <meshBasicMaterial ref={materialRef} color={shade(accent, -95)} toneMapped={false} transparent />
  );
}

function Cover({ work, materialRef }) {
  if (!work.image) {
    return <CoverPlaceholder accent={work.accent} materialRef={materialRef} />;
  }
  return (
    <Suspense fallback={<CoverPlaceholder accent={work.accent} materialRef={materialRef} />}>
      <CoverImage src={work.image} materialRef={materialRef} />
    </Suspense>
  );
}

// phase: "entering" fades/slides in from the left, "exiting" fades/slides
// out to the right. Both meshes and the Html overlay are driven by refs
// (not React props) so per-frame updates never trigger a re-render.
export default function WorkFrame({ work, phase, onExited }) {
  const groupRef = useRef(null);
  const borderMatRef = useRef(null);
  const coverMatRef = useRef(null);
  const cardRef = useRef(null);
  const progress = useRef(0);
  const exitedRef = useRef(false);
  const [showInfo, setShowInfo] = useState(false);

  const isExiting = phase === "exiting";

  useLayoutEffect(() => {
    progress.current = 0;
    exitedRef.current = false;
    const startX = isExiting ? 0 : -ENTER_OFFSET;
    const startOpacity = isExiting ? 1 : 0;
    if (groupRef.current) groupRef.current.position.x = startX;
    if (borderMatRef.current) borderMatRef.current.opacity = startOpacity;
    if (coverMatRef.current) coverMatRef.current.opacity = startOpacity;
    if (cardRef.current) cardRef.current.style.opacity = String(startOpacity);
    // Only the phase transition should reset the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * ANIM_SPEED);
    }
    const t = progress.current;
    const eased = isExiting ? t * t : 1 - Math.pow(1 - t, 3);
    const x = isExiting
      ? THREE.MathUtils.lerp(0, EXIT_OFFSET, eased)
      : THREE.MathUtils.lerp(-ENTER_OFFSET, 0, eased);
    const opacity = isExiting ? 1 - eased : eased;

    group.position.x = x;
    if (borderMatRef.current) borderMatRef.current.opacity = opacity;
    if (coverMatRef.current) coverMatRef.current.opacity = opacity;

    if (cardRef.current) {
      cardRef.current.style.opacity = String(opacity);
    }

    if (isExiting && t >= 1 && !exitedRef.current) {
      exitedRef.current = true;
      onExited?.();
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[FRAME_WIDTH + 0.08, FRAME_HEIGHT + 0.08]} />
        <meshBasicMaterial ref={borderMatRef} color={work.accent} toneMapped={false} transparent />
      </mesh>

      <mesh>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <Cover work={work} materialRef={coverMatRef} />
      </mesh>

      <Html center occlude={false} position={[0, 0, 0.05]} zIndexRange={[10, 0]}>
        <div ref={cardRef} className="work-card" style={{ "--accent": work.accent }}>
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
