import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TextHologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uMap: null,
    uColor: new THREE.Color("#00eaff"),
    uOpacity: 1,
  },
  // vertex
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment
  `
  uniform float uTime;
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.05) discard; // descarta pixeles fuera de las letras

    float scan = sin((vUv.y * 120.0) - uTime * 4.0) * 0.5 + 0.5;
    scan = smoothstep(0.3, 1.0, scan);

    float flicker = 0.9 + 0.1 * sin(uTime * 30.0);

    float alpha = tex.a * uOpacity * (0.6 + scan * 0.4) * flicker;
    vec3 color = uColor * (1.0 + scan * 0.5);

    gl_FragColor = vec4(color, alpha);
  }
  `,
);

extend({ TextHologramMaterial });

function useTextTexture(
  text,
  { font = "bold 90px sans-serif", color = "#ffffff" } = {},
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;
    const metrics = ctx.measureText(text);

    const padding = 30;
    canvas.width = Math.ceil(metrics.width) + padding * 2;
    canvas.height = 140;

    // hay que reasignar font después de cambiar canvas.width/height,
    // porque redimensionar el canvas resetea el contexto
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    return { texture, aspect: canvas.width / canvas.height };
  }, [text, font, color]);
}

export default function TextHologram({
  text = "ACCESO",
  position = [0, 0, 0],
  color = "#00eaff",
  fontSize = 1,
  font,
}) {
  const matRef = useRef();
  const lightRef = useRef();
  const { texture, aspect } = useTextTexture(text, { font });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) matRef.current.uTime = t;
    if (lightRef.current)
      lightRef.current.intensity = 1.2 + Math.sin(t * 8) * 0.3;
  });

  return (
    <group position={position}>
      <mesh scale={[fontSize * aspect, fontSize, 1]}>
        <planeGeometry args={[1, 1]} />
        <textHologramMaterial
          ref={matRef}
          uMap={texture}
          uColor={new THREE.Color(color)}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.2} distance={4} />
    </group>
  );
}
