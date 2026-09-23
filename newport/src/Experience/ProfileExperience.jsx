import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Text3D, Center, Outlines, Image } from "@react-three/drei";
import { profileData } from "./utils/profileData";
import HoverGridTrail from "./HoverGridTrail";
import { getResponsiveFraming } from "./utils/responsiveFov";
import { useIsMobile } from "./utils/useIsMobile";
import photoPlaceholder from "../assets/pfp.jpeg";
import CorreoD from "../Experience/components/icons/CorreoD";
import GithubD from "../Experience/components/icons/GithubD";
import PersonaD from "../Experience/components/icons/PersonaD";
import LinkedinD from "../Experience/components/icons/LinkedinD";
import InteractiveIcon from "../Experience/components/icons/InteractiveIcon";

const GRID_COLORS = {
  background: "#1A1A1A",
  plane: "#2A2A2A",
  cell: "#534846",
  section: "#c084fc",
  role: "#E9D5FF",
};

const CAMERA_POSITION = [0, 14, 10];
const CAMERA_LOOK_AT = [4, 4, 0];

// Fixed once from the desktop position/look-at so the camera keeps the same
// viewing angle everywhere; mobile only changes where it aims and how far
// back it sits along that angle.
const CAMERA_OFFSET = CAMERA_POSITION.map((v, i) => v - CAMERA_LOOK_AT[i]);

const CAMERA_BASE_FOV = 38;
const CAMERA_BASE_ASPECT = 16 / 9;
const CAMERA_MAX_FOV = 60;
const CAMERA_MAX_DISTANCE_SCALE = 2;

const MOBILE_FOV = 50;
const MOBILE_LOOK_AT = [0.42, 0.5, -1.11];
const MOBILE_FIT_WIDTH = { a: 0.318, b: 0.614 };
const MOBILE_FIT_HEIGHT = 1.064;

function getCameraFraming(isMobile, aspect) {
  if (isMobile) {
    return {
      fovDeg: MOBILE_FOV,
      lookAt: MOBILE_LOOK_AT,
      distanceScale: Math.max(
        MOBILE_FIT_WIDTH.a + MOBILE_FIT_WIDTH.b / aspect,
        MOBILE_FIT_HEIGHT,
      ),
    };
  }
  const { fovDeg, distanceScale } = getResponsiveFraming(
    CAMERA_BASE_FOV,
    CAMERA_BASE_ASPECT,
    aspect,
    CAMERA_MAX_FOV,
  );
  return {
    fovDeg,
    lookAt: CAMERA_LOOK_AT,
    distanceScale: Math.min(distanceScale, CAMERA_MAX_DISTANCE_SCALE),
  };
}

function ResponsiveCamera({ isMobile }) {
  useFrame((state) => {
    const { camera, size } = state;
    const { fovDeg, lookAt, distanceScale } = getCameraFraming(
      isMobile,
      size.width / size.height,
    );

    if (Math.abs(camera.fov - fovDeg) > 0.01) {
      camera.fov = fovDeg;
      camera.updateProjectionMatrix();
    }
    camera.position.set(
      lookAt[0] + CAMERA_OFFSET[0] * distanceScale,
      lookAt[1] + CAMERA_OFFSET[1] * distanceScale,
      lookAt[2] + CAMERA_OFFSET[2] * distanceScale,
    );
    camera.lookAt(...lookAt);
  });
  return null;
}

const PLANE_SIZE = 160;

const NAME_FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const NAME_TEXT_POSITION = [2, 1, -10];
const NAME_TEXT_SIZE = 1.3;
const NAME_TEXT_DEPTH = 0.18;

const TEXT_TILT = [-Math.PI / 2 + 0.7, 0, 0];

const PHOTO_POSITION = [0, 0.1, -2.3];
const PHOTO_SIZE = 5;
const PHOTO_RADIUS = 0.08;
const ICON_SCALE = 0.25;
const ICON_CORREO = {
  position: [0.6, 0.8, 0.4],
  rotation: [-Math.PI / 2, 0, 0],
};
const ICON_GITHUB = {
  position: [2, 0.8, -1.2],
  rotation: [-Math.PI / 2, 0, 0],
};
const ICON_LINKEDIN = {
  position: [3.4, 0.8, 1.9],
  rotation: [-Math.PI / 2, 0, 0],
};
const ICON_PERSONA = {
  position: [-0.8, 0.8, -2.8],
  rotation: [-Math.PI / 2, 0, 0],
};

const ICONS_LIGHT_POSITION = [1.3, 4.5, -0.4];
const ICONS_LIGHT_INTENSITY = 35;

const GLOW_CORREO = GRID_COLORS.section;
const GLOW_GITHUB = "#ffffff";
const GLOW_LINKEDIN = "#0A66C2";
const GLOW_PERSONA = GRID_COLORS.section;

const LAYOUT = {
  desktop: {
    nameSize: NAME_TEXT_SIZE,
    name: NAME_TEXT_POSITION,
    apellido: [2.3, 1, -7],
    roleSize: 0.8,
    roleYaw: -1.5,
    role: [12, 1, -1.5],
    role2: [10.5, 1, -1],
  },
  mobile: {
    nameSize: 0.85,
    name: [6, 1, -8.6],
    apellido: [4.2, 1, -6.6],
    roleSize: 0.55,
    roleYaw: 0,
    role: [-2.1, 1, 2.4],
    role2: [0.28, 1, 3.65],
  },
};

export default function ProfileExperience({ onOpenPersonaInfo }) {
  const isMobile = useIsMobile();
  const layout = isMobile ? LAYOUT.mobile : LAYOUT.desktop;

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true }}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_BASE_FOV }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[GRID_COLORS.background]} />
      <fog attach="fog" args={[GRID_COLORS.background, 20, 55]} />

      <ResponsiveCamera isMobile={isMobile} />

      <ambientLight intensity={0.55} />
      <pointLight
        position={[-5, 6, 4]}
        intensity={18}
        color={GRID_COLORS.section}
      />
      <pointLight position={[5, 3, 6]} intensity={10} color="#ffffff" />
      <pointLight
        position={ICONS_LIGHT_POSITION}
        intensity={ICONS_LIGHT_INTENSITY}
        color="#ffffff"
      />

      <group name="tech-skills-models" position={[0, -18, 0]} />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
        <meshBasicMaterial color={GRID_COLORS.plane} toneMapped={false} />
      </mesh>
      <Center position={layout.name}>
        <Text3D
          font={NAME_FONT_URL}
          size={layout.nameSize}
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
      <Center position={layout.apellido}>
        <Text3D
          font={NAME_FONT_URL}
          size={layout.nameSize}
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

      <group position={layout.role} rotation={[0, layout.roleYaw, 0]}>
        <Center>
          <Text3D
            font={NAME_FONT_URL}
            size={layout.roleSize}
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
      <group position={layout.role2} rotation={[0, layout.roleYaw, 0]}>
        <Center>
          <Text3D
            font={NAME_FONT_URL}
            size={layout.roleSize}
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
      <InteractiveIcon
        position={ICON_CORREO.position}
        rotation={ICON_CORREO.rotation}
        scale={ICON_SCALE}
        glowColor={GLOW_CORREO}
        url={`mailto:${profileData.contact.email}`}
      >
        <CorreoD />
      </InteractiveIcon>

      <InteractiveIcon
        position={ICON_GITHUB.position}
        rotation={ICON_GITHUB.rotation}
        scale={ICON_SCALE}
        glowColor={GLOW_GITHUB}
        url={profileData.contact.github}
      >
        <GithubD />
      </InteractiveIcon>

      <InteractiveIcon
        position={ICON_LINKEDIN.position}
        rotation={ICON_LINKEDIN.rotation}
        scale={ICON_SCALE}
        glowColor={GLOW_LINKEDIN}
        url={profileData.contact.linkedin}
      >
        <LinkedinD />
      </InteractiveIcon>

      <InteractiveIcon
        position={ICON_PERSONA.position}
        rotation={ICON_PERSONA.rotation}
        scale={ICON_SCALE}
        glowColor={GLOW_PERSONA}
        onIconClick={onOpenPersonaInfo}
      >
        <PersonaD />
      </InteractiveIcon>
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
