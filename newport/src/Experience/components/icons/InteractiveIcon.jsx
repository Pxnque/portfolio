import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HOVER_LIFT = 0.4; // world units the icon rises on hover
const LIFT_DAMPING = 8; // higher = snappier elevate/settle
const GLOW_SIZE = 1.8; // glow sprite scale relative to the icon
const GLOW_MAX_OPACITY = 0.85;

let sharedGlowTexture = null;
function getGlowTexture() {
  if (sharedGlowTexture) return sharedGlowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  sharedGlowTexture = new THREE.CanvasTexture(canvas);
  return sharedGlowTexture;
}

export default function InteractiveIcon({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glowColor = "#c084fc",
  url,
  onIconClick,
  children,
}) {
  const liftRef = useRef(null);
  const modelRef = useRef(null);
  const glowMatRef = useRef(null);
  const glowMeshRef = useRef(null);
  const hoverAmount = useRef(0);
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    if (!modelRef.current || !liftRef.current || !glowMeshRef.current) return;
    modelRef.current.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(modelRef.current);
    if (box.isEmpty()) return;
    const worldCenter = box.getCenter(new THREE.Vector3());
    const localCenter = liftRef.current.worldToLocal(worldCenter);
    glowMeshRef.current.position.copy(localCenter);
  }, []);

  useEffect(() => {
    return () => {
      if (hovered) document.body.style.cursor = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    hoverAmount.current = THREE.MathUtils.damp(
      hoverAmount.current,
      target,
      LIFT_DAMPING,
      delta,
    );

    if (liftRef.current) {
      liftRef.current.position.y = hoverAmount.current * HOVER_LIFT;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = hoverAmount.current * GLOW_MAX_OPACITY;
    }
    if (glowMeshRef.current) {
      const s = GLOW_SIZE * (1 + hoverAmount.current * 0.25);
      glowMeshRef.current.scale.set(s, s, 1);
    }
  });

  const isInteractive = Boolean(url || onIconClick);

  const handlePointerOver = (event) => {
    event.stopPropagation();
    setHovered(true);
    if (isInteractive) document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (event) => {
    event.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (onIconClick) {
      onIconClick();
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group
        ref={liftRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sprite ref={glowMeshRef} scale={[GLOW_SIZE, GLOW_SIZE, 1]}>
          <spriteMaterial
            ref={glowMatRef}
            map={getGlowTexture()}
            color={glowColor}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <group ref={modelRef}>{children}</group>
      </group>
    </group>
  );
}
