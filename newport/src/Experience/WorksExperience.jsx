import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import WorkFrame from "./components/WorkFrame";

export default function WorksExperience({ work, direction }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 7.4], fov: 32 }}
    >
      <color attach="background" args={["#08080a"]} />
      <fog attach="fog" args={["#08080a", 9, 17]} />

      <ambientLight intensity={0.6} />
      <pointLight position={[-4, -1, 3]} intensity={25} color={work.accent} />

      <Suspense fallback={null}>
        <WorkFrame key={work.id} work={work} direction={direction} />
      </Suspense>

      <mesh position={[0, -2.05, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#08080a"
          metalness={0.5}
        />
      </mesh>
    </Canvas>
  );
}
