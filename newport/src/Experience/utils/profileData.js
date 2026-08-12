// Placeholder profile data. Replace with real info:
//   - name / role: your own copy
//   - contact.github / contact.linkedin: your real profile URLs
//   - photo: import an image and wire it into ProfileSection's photo slot
//   - education / languages / softSkills / techSkills: your real entries
// contact.email is already your real address from this project's context.

export const profileData = {
  name: "Tu Nombre Completo",
  role: "Fullstack Software Developer",
  contact: {
    email: "panque08@outlook.es",
    github: "https://github.com/tu-usuario",
    linkedin: "https://linkedin.com/in/tu-usuario",
  },
  education: [
    {
      id: "edu-1",
      title: "Ingeniería en Sistemas Computacionales",
      institution: "Tu Universidad",
      period: "2019 - 2023",
    },
    {
      id: "edu-2",
      title: "Certificación placeholder",
      institution: "Institución",
      period: "2023",
    },
  ],
  languages: [
    { id: "lang-1", name: "Español", level: "Nativo" },
    { id: "lang-2", name: "Inglés", level: "Avanzado" },
  ],
  softSkills: [
    "Comunicación",
    "Trabajo en equipo",
    "Resolución de problemas",
    "Adaptabilidad",
    "Gestión del tiempo",
  ],
  // Each entry gets an empty 3D slot in ProfileExperience's
  // "tech-skills-models" group, ready for a Blender GLTF per technology.
  techSkills: ["React", "JavaScript", "Three.js", "Node.js", "Laravel", "PHP"],
};
