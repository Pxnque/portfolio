import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import WorksStage from "./components/WorksStage";
import TextHologram from "./TextHologram";
import Holograma from "./Hologram";
import { getResponsiveFov } from "./utils/responsiveFov";
import { useIsMobile } from "./utils/useIsMobile";

const CARD_Y = 1.55;
const CAMERA_BASE = [0, 2.6, 10.5];
const LOOK_TARGET = [0, 1, 0];
const PARALLAX_STRENGTH = [0.3, 0.14]; // world units, x / y — kept small on purpose

const CAMERA_BASE_FOV = 36;
const CAMERA_BASE_ASPECT = 16 / 9;

const CAMERA_MAX_FOV = 66;

function CameraRig() {
  useFrame((state, delta) => {
    const { camera, pointer, size } = state;

    const targetFov = getResponsiveFov(
      CAMERA_BASE_FOV,
      CAMERA_BASE_ASPECT,
      size.width / size.height,
      CAMERA_MAX_FOV,
    );
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }

    const damp = Math.min(1, delta * 3);
    const targetX = CAMERA_BASE[0] + pointer.x * PARALLAX_STRENGTH[0];
    const targetY = CAMERA_BASE[1] - pointer.y * PARALLAX_STRENGTH[1];
    camera.position.x += (targetX - camera.position.x) * damp;
    camera.position.y += (targetY - camera.position.y) * damp;
    camera.lookAt(LOOK_TARGET[0], LOOK_TARGET[1], LOOK_TARGET[2]);
  });
  return null;
}

export default function WorksExperience({ work, direction, onInfoClick }) {
  const isMobile = useIsMobile();

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true }}
      camera={{ position: CAMERA_BASE, fov: CAMERA_BASE_FOV }}
    >
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 12, 24]} />

      <CameraRig />
      {/* <TextHologram
        text="삼성전자 멕시코 생산"
        position={[-3, 2, -8]}
        color="#9201CB"
        fontSize={1.3}
      />
      <TextHologram
        text="Currently learning rust"
        position={[1, 5, -12]}
        color="#a200ff"
        fontSize={1.3}
      /> */}
      <Holograma
        position={[9, 4.85, -10.51]}
        color="#FF5F1F"
        scale={[6, 3, 1]}
      />
      <Holograma
        position={[-9, 4.85, -6.51]}
        color="#3717ee"
        scale={[3, 9, 2]}
      />
      {/* Postprocessing is a handful of extra full-screen passes — skip it
          on mobile GPUs rather than risk a choppy/hot phone. */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={1.3}
            mipmapBlur
          />
          <ChromaticAberration
            offset={[0.0008, 0.0008]}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise opacity={0.025} />
          <Vignette eskil={false} offset={0.15} darkness={1.1} />
        </EffectComposer>
      )}

      <ambientLight intensity={0.5} />
      <pointLight position={[-4, 3.2, 3]} intensity={22} color={work.accent} />
      <pointLight position={[4, 1.6, 4]} intensity={10} color="#ffffff" />

      <Suspense fallback={null}>
        <group position={[0, CARD_Y, 0]}>
          <WorksStage
            work={work}
            direction={direction}
            onInfoClick={onInfoClick}
          />
        </group>
      </Suspense>

      {/* Thin emissive bars: their only job is to streak color across the
          reflective floor, cheap stand-ins for real neon signage. */}
      <mesh position={[-3.1, 1.6, -1.2]}>
        <planeGeometry args={[0.04, 2.2]} />
        <meshBasicMaterial color={work.accent} toneMapped={false} />
      </mesh>
      <mesh position={[3.3, 1, -1.8]}>
        <planeGeometry args={[0.04, 1.5]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          mirror={0.15}
          roughness={0.9}
          depthScale={1}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.4}
          color="#534846"
          metalness={0.6}
        />
      </mesh>
    </Canvas>
  );
}
