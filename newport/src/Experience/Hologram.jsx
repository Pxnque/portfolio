import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import * as THREE from "three";
import { useRef } from "react";

extend({ TextGeometry });

const HologramMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#00eaff"), uOpacity: 0.6 },
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float scan = smoothstep(0.4, 1.0, sin((vPosition.y - uTime * 1.5) * 40.0) * 0.5 + 0.5);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
    float flicker = 0.85 + 0.15 * sin(uTime * 25.0);
    float alpha = (scan * 0.5 + fresnel * 0.7) * uOpacity * flicker;
    gl_FragColor = vec4(uColor, alpha);
  }
  `,
);

extend({ HologramMaterial });

export default function Holograma({
  position,
  scale = [1, 2, 1],
  color = "#00eaff",
}) {
  const matRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) matRef.current.uTime = t;
    if (lightRef.current)
      lightRef.current.intensity = 1.4 + Math.sin(t * 10) * 0.3;
  });

  return (
    <group position={position}>
      <mesh scale={scale}>
        <planeGeometry args={[1, 1, 1, 24]} />
        <hologramMaterial
          ref={matRef}
          uColor={new THREE.Color(color)}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.5} distance={5} />
    </group>
  );
}
