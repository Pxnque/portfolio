import { useEffect } from "react";
import ProfileExperience from "../Experience/ProfileExperience";
import { profileData } from "../Experience/utils/profileData";
import "./ProfileSection.css";

export default function ProfileSection({ onNavigateWorks, onArrived }) {
  const { name, role, contact, education, languages, softSkills, techSkills } =
    profileData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="profile" className="profile-section">
      <div className="profile-canvas">
        <ProfileExperience onArrived={onArrived} />
      </div>

      <button
        type="button"
        className="works-pill profile-pill"
        onClick={onNavigateWorks}
      >
        WORKS
      </button>

      <div className="profile-content">
        <header className="profile-hero">
          <div className="profile-photo" aria-hidden="true">
            <span>Foto</span>
          </div>
          <h1 className="profile-name">{name}</h1>
          <p className="profile-role">{role}</p>

          <div className="profile-actions">
            <a
              className="profile-btn profile-btn--solid"
              href={`mailto:${contact.email}`}
            >
              Contact Me
            </a>
            <a
              className="profile-btn"
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="profile-btn"
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="profile-scroll-hint">Scroll para explorar</div>
        </header>

        <section className="profile-block">
          <h2 className="profile-block__title">Educación</h2>
          <ul className="profile-list">
            {education.map((item) => (
              <li key={item.id} className="profile-list__item">
                <p className="profile-list__primary">{item.title}</p>
                <p className="profile-list__secondary">
                  {item.institution} · {item.period}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="profile-block">
          <h2 className="profile-block__title">Languages</h2>
          <ul className="profile-tags">
            {languages.map((item) => (
              <li key={item.id} className="profile-tag">
                {item.name}
                <span className="profile-tag__level">{item.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="profile-block">
          <h2 className="profile-block__title">Soft Skills</h2>
          <ul className="profile-tags">
            {softSkills.map((skill) => (
              <li key={skill} className="profile-tag">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="profile-block profile-block--tech">
          <h2 className="profile-block__title">Tech Skills</h2>
          <p className="profile-block__hint">
            Espacio reservado para modelos 3D (Blender) por tecnología.
          </p>
          <ul className="profile-tech-grid">
            {techSkills.map((skill) => (
              <li key={skill} className="profile-tech-slot">
                <span className="profile-tech-slot__placeholder" aria-hidden="true" />
                <span className="profile-tech-slot__label">{skill}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
