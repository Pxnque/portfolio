import { Canvas, useThree } from "@react-three/fiber";
import { Grid, Text3D, Center } from "@react-three/drei";
import { profileData } from "./utils/profileData";

// A separate Canvas from WORKS on purpose: the nav transition is always
// masked by TransitionScreen, so there's no visible seam between the two,
// and keeping them independent means nothing here can regress WORKS.

const GRID_COLORS = {
  background: "#1A1A1A",
  plane: "#2A2A2A",
  cell: "#534846",
  section: "#c084fc",
  role: "#E9D5FF",
};

// --- Camera (static, no scroll/parallax movement) --------------------
// CAMERA_POSITION: [x, y, z] where the camera sits in world space.
//   - y: height above the plane.
//   - z: how far back the camera is pulled from the plane's center.
// CAMERA_LOOK_AT: [x, y, z] point the camera aims at (keep y at 0 to
//   look at the plane's surface).
// The look-down angle is atan((CAMERA_POSITION.y - CAMERA_LOOK_AT.y) /
// (CAMERA_POSITION.z - CAMERA_LOOK_AT.z)) — currently 45deg since Y and Z
// are equal (14 and 14). Adjust either value to change the angle.
const CAMERA_POSITION = [0, 14, 10];
const CAMERA_LOOK_AT = [4, 4, 0];

const PLANE_SIZE = 160;

// --- Name text (Text3D) -----------------------------------------------
// Font is a local typeface JSON (drei's Text3D needs the facetype.js
// format, not a regular .ttf/.otf) served from public/fonts.
// NAME_TEXT_POSITION / NAME_TEXT_SIZE are separate from the camera
// constants above so you can tune the text placement independently.
const NAME_FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const NAME_TEXT_POSITION = [4, 1, -10];
const NAME_TEXT_SIZE = 1.3;
const NAME_TEXT_DEPTH = 0.18;

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

      {/* Reserved for future Blender tech-skill models: one small GLTF
          per technology, loaded with useGLTF and positioned here. */}
      <group name="tech-skills-models" position={[0, -18, 0]} />

      {/* Solid base plane, with a fading grid/wireframe layered just above
          it so the lines never z-fight with the surface underneath. */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
        <meshBasicMaterial color={GRID_COLORS.plane} toneMapped={false} />
      </mesh>
      <Center position={NAME_TEXT_POSITION}>
        <Text3D
          font={NAME_FONT_URL}
          size={NAME_TEXT_SIZE}
          rotation={[-Math.PI / 2 + 0.7, 0, 0]}
          height={NAME_TEXT_DEPTH}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.name}
          <meshBasicMaterial color={GRID_COLORS.section} toneMapped={false} />
        </Text3D>
      </Center>
      <Center position={[2.3, 1, -7]}>
        <Text3D
          font={NAME_FONT_URL}
          size={NAME_TEXT_SIZE}
          height={NAME_TEXT_DEPTH}
          rotation={[-Math.PI / 2 + 0.7, 0, 0]}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.apellido}
          <meshBasicMaterial color={GRID_COLORS.section} toneMapped={false} />
        </Text3D>
      </Center>
      <Center position={[23, 1, -8]}>
        <Text3D
          font={NAME_FONT_URL}
          size={0.8}
          height={NAME_TEXT_DEPTH}
          rotation={[0, -1.5, 0]}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.role}
          <meshBasicMaterial color={GRID_COLORS.role} toneMapped={false} />
        </Text3D>
      </Center>
      <Center position={[10.5, 1, -2]}>
        <Text3D
          font={NAME_FONT_URL}
          size={0.8}
          height={NAME_TEXT_DEPTH}
          rotation={[0, -1.5, 0]}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.015}
          bevelSegments={5}
        >
          {profileData.role2}
          <meshBasicMaterial color={GRID_COLORS.role} toneMapped={false} />
        </Text3D>
      </Center>

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
    </Canvas>
  );
}
