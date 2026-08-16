import { Canvas, useThree } from "@react-three/fiber";
import { Grid, Text3D, Center, Outlines, Image } from "@react-three/drei";
import { profileData } from "./utils/profileData";
import HoverGridTrail from "./HoverGridTrail";
import photoPlaceholder from "../assets/pfp.jpeg";

const GRID_COLORS = {
  background: "#1A1A1A",
  plane: "#2A2A2A",
  cell: "#534846",
  section: "#c084fc",
  role: "#E9D5FF",
};

const CAMERA_POSITION = [0, 14, 10];
const CAMERA_LOOK_AT = [4, 4, 0];

const PLANE_SIZE = 160;

const NAME_FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const NAME_TEXT_POSITION = [4, 1, -10];
const NAME_TEXT_SIZE = 1.3;
const NAME_TEXT_DEPTH = 0.18;

const TEXT_TILT = [-Math.PI / 2 + 0.7, 0, 0];

const PHOTO_POSITION = [0, 0.1, -2.3];
const PHOTO_SIZE = 5;
const PHOTO_RADIUS = 0.08;

export default function ProfileExperience() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ position: CAMERA_POSITION, fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[GRID_COLORS.background]} />
      <fog attach="fog" args={[GRID_COLORS.background, 20, 55]} />

      <ambientLight intensity={0.55} />
      <pointLight
        position={[-5, 6, 4]}
        intensity={18}
        color={GRID_COLORS.section}
      />
      <pointLight position={[5, 3, 6]} intensity={10} color="#ffffff" />

      <group name="tech-skills-models" position={[0, -18, 0]} />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
        <meshBasicMaterial color={GRID_COLORS.plane} toneMapped={false} />
      </mesh>
      <Center position={NAME_TEXT_POSITION}>
        <Text3D
          font={NAME_FONT_URL}
          size={NAME_TEXT_SIZE}
          rotation={TEXT_TILT}
          height={NAME_TEXT_DEPTH}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.name}
          <meshBasicMaterial color={GRID_COLORS.section} toneMapped={false} />
          <Outlines thickness={0.035} color="#000000" screenspace />
        </Text3D>
      </Center>
      <Center position={[2.3, 1, -7]}>
        <Text3D
          font={NAME_FONT_URL}
          size={NAME_TEXT_SIZE}
          height={NAME_TEXT_DEPTH}
          rotation={TEXT_TILT}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.apellido}
          <meshBasicMaterial color={GRID_COLORS.section} toneMapped={false} />
          <Outlines thickness={0.035} color="#000000" screenspace />
        </Text3D>
      </Center>

      <group position={PHOTO_POSITION} rotation={[-Math.PI / 2, 0, 0]}>
        <Image
          url={photoPlaceholder}
          scale={PHOTO_SIZE}
          radius={PHOTO_RADIUS}
          zoom={1.5}
        />
      </group>

      <group position={[12, 1, -4.5]} rotation={[0, -1.5, 0]}>
        <Center>
          <Text3D
            font={NAME_FONT_URL}
            size={0.8}
            height={NAME_TEXT_DEPTH}
            rotation={[-Math.PI / 2 + 0.9, 0, 0]}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.015}
            bevelSegments={5}
          >
            {profileData.role}
            <meshBasicMaterial color={GRID_COLORS.role} toneMapped={false} />
            <Outlines thickness={0.025} color="#000000" screenspace />
          </Text3D>
        </Center>
      </group>
      <group position={[10.5, 1, -1]} rotation={[0, -1.5, 0]}>
        <Center>
          <Text3D
            font={NAME_FONT_URL}
            size={0.8}
            height={NAME_TEXT_DEPTH}
            rotation={[-Math.PI / 2 + 0.9, 0, 0]}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.015}
            bevelSegments={5}
          >
            {profileData.role2}
            <meshBasicMaterial color={GRID_COLORS.role} toneMapped={false} />
            <Outlines thickness={0.025} color="#000000" screenspace />
          </Text3D>
        </Center>
      </group>

      <Grid
        position={[0, 0.01, 0]}
        args={[PLANE_SIZE, PLANE_SIZE]}
        cellSize={1}
        cellThickness={0.6}
        cellColor={GRID_COLORS.cell}
        sectionSize={5}
        sectionThickness={1.4}
        sectionColor={GRID_COLORS.section}
        fadeDistance={45}
        fadeStrength={1.5}
        infiniteGrid
      />

      <HoverGridTrail
        planeSize={PLANE_SIZE}
        cellSize={1}
        position={[0, 0.02, 0]}
      />
    </Canvas>
  );
}
