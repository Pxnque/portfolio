import { useCallback, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const MAX_TRAIL = 24;
const TRAIL_LIFETIME = 1.1; // seconds for a point to fully fade
const MIN_POINT_SPACING = 0.005; // in UV units (0..1); throttles new points

const HoverGridMaterial = shaderMaterial(
  {
    uTrailPos: new Array(MAX_TRAIL)
      .fill(0)
      .map(() => new THREE.Vector2(-999, -999)),
    uTrailAge: new Array(MAX_TRAIL).fill(1),
    uTrailCount: 0,
    uCellSizeUV: 1 / 160,
    uColorA: new THREE.Color("#818CF8"),
    uColorB: new THREE.Color("#E9D5FF"),
    uColorC: new THREE.Color("#C084FC"),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    uniform vec2 uTrailPos[${MAX_TRAIL}];
    uniform float uTrailAge[${MAX_TRAIL}];
    uniform int uTrailCount;
    uniform float uCellSizeUV;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    // t: 0 = freshest/hottest point, 1 = fully faded.
    vec3 trailGradient(float t) {
      if (t < 0.5) return mix(uColorB, uColorC, t * 2.0);
      return mix(uColorC, uColorA, (t - 0.5) * 2.0);
    }

    void main() {
      vec2 myCell = floor(vUv / uCellSizeUV);
      float glow = 0.0;
      float bestAge = 1.0;

      for (int i = 0; i < ${MAX_TRAIL}; i++) {
        if (i >= uTrailCount) break;
        vec2 pCell = floor(uTrailPos[i] / uCellSizeUV);
        if (distance(pCell, myCell) < 0.5) {
          float fade = 1.0 - uTrailAge[i];
          if (fade > glow) {
            glow = fade;
            bestAge = uTrailAge[i];
          }
        }
      }

      if (glow <= 0.01) discard;

      vec2 cellUv = fract(vUv / uCellSizeUV);
      float edge = min(min(cellUv.x, 1.0 - cellUv.x), min(cellUv.y, 1.0 - cellUv.y));
      float edgeFade = smoothstep(0.0, 0.2, edge);

      gl_FragColor = vec4(trailGradient(bestAge), glow * edgeFade * 0.9);
    }
  `,
);

extend({ HoverGridMaterial });

export default function HoverGridTrail({
  planeSize = 160,
  cellSize = 1,
  position = [0, 0.02, 0],
}) {
  const materialRef = useRef(null);
  const pointsRef = useRef([]); // { uv: THREE.Vector2, spawn: seconds }
  const lastUvRef = useRef(null);

  const handlePointerMove = useCallback((event) => {
    if (!event.uv) return;
    if (
      lastUvRef.current &&
      lastUvRef.current.distanceTo(event.uv) < MIN_POINT_SPACING
    ) {
      return;
    }
    lastUvRef.current = event.uv.clone();
    pointsRef.current.push({
      uv: event.uv.clone(),
      spawn: performance.now() / 1000,
    });
    if (pointsRef.current.length > MAX_TRAIL) pointsRef.current.shift();
  }, []);

  const handlePointerLeave = useCallback(() => {
    lastUvRef.current = null;
  }, []);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const now = performance.now() / 1000;
    pointsRef.current = pointsRef.current.filter(
      (p) => now - p.spawn < TRAIL_LIFETIME,
    );

    const count = Math.min(pointsRef.current.length, MAX_TRAIL);
    for (let i = 0; i < count; i++) {
      const p = pointsRef.current[i];
      material.uniforms.uTrailPos.value[i].copy(p.uv);
      material.uniforms.uTrailAge.value[i] = (now - p.spawn) / TRAIL_LIFETIME;
    }
    material.uniforms.uTrailCount.value = count;
  });

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[planeSize, planeSize]} />
      <hoverGridMaterial
        ref={materialRef}
        uCellSizeUV={cellSize / planeSize}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
