import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

// A separate Canvas from WORKS on purpose: the nav transition is always
// masked by TransitionScreen, so there's no visible seam between the two,
// and keeping them independent means nothing here can regress WORKS.
const CAMERA_REST = [0, 4, 9];
const CAMERA_ENTRY_OFFSET = [0, 2, 6];
const LOOK_TARGET = [0, 2, 0];
const SCROLL_TRAVEL = 22; // world units the camera descends across full scroll
const SETTLE_SPEED = 2.2;
const PARALLAX_STRENGTH = 0.2;

function getScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function CameraRig({ onArrived }) {
  const settleProgress = useRef(0);
  const arrivedRef = useRef(false);

  useFrame((state, delta) => {
    const { camera, pointer } = state;

    if (settleProgress.current < 1) {
      settleProgress.current = Math.min(1, settleProgress.current + delta * SETTLE_SPEED);
    }
    const settle = 1 - Math.pow(1 - settleProgress.current, 3);

    const scrollT = getScrollProgress();
    const scrollOffsetY = scrollT * SCROLL_TRAVEL;

    const startY = CAMERA_ENTRY_OFFSET[1] - scrollOffsetY;
    const restY = CAMERA_REST[1] - scrollOffsetY;

    camera.position.x = THREE.MathUtils.lerp(CAMERA_ENTRY_OFFSET[0], CAMERA_REST[0], settle) + pointer.x * PARALLAX_STRENGTH;
    camera.position.y = THREE.MathUtils.lerp(startY, restY, settle);
    camera.position.z = THREE.MathUtils.lerp(CAMERA_ENTRY_OFFSET[2], CAMERA_REST[2], settle);
    camera.lookAt(LOOK_TARGET[0], LOOK_TARGET[1] - scrollOffsetY, LOOK_TARGET[2]);

    if (!arrivedRef.current && settleProgress.current >= 1) {
      arrivedRef.current = true;
      onArrived?.();
    }
  });

  return null;
}

export default function ProfileExperience({ onArrived }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: CAMERA_ENTRY_OFFSET, fov: 38 }}
    >
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 14, 30]} />

      <ambientLight intensity={0.55} />
      <pointLight position={[-5, 6, 4]} intensity={18} color="#c084fc" />
      <pointLight position={[5, 3, 6]} intensity={10} color="#ffffff" />

      <CameraRig onArrived={onArrived} />

      {/* Reserved for future Blender tech-skill models: one small GLTF
          per technology, loaded with useGLTF and positioned here to line
          up with the Tech Skills section further down the scroll. */}
      <group name="tech-skills-models" position={[0, -18, 0]} />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={512}
          mixBlur={1}
          mixStrength={35}
          mirror={0.12}
          roughness={0.9}
          depthScale={1}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.4}
          color="#17171c"
          metalness={0.55}
        />
      </mesh>
    </Canvas>
  );
}
