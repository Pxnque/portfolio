import { useState } from "react";
import ProfileExperience from "../Experience/ProfileExperience";
import PersonaInfoModal from "./PersonaInfoModal";
import { profileData } from "../Experience/utils/profileData";
import "./ProfileSection.css";

export default function ProfileSection({ onNavigateWorks }) {
  const [personaInfoOpen, setPersonaInfoOpen] = useState(false);

  return (
    <section id="profile" className="profile-section">
      <div className="profile-canvas">
        <ProfileExperience onOpenPersonaInfo={() => setPersonaInfoOpen(true)} />
      </div>

      <div className="profile-ui">
        <div className="profile-pill-group">
          <span className="profile-pill">PROFILE</span>
          <button
            type="button"
            className="profile-pill profile-pill--works"
            onClick={onNavigateWorks}
          >
            WORKS
          </button>
          <a
            className="profile-pill profile-pill--works profile-pill--link"
            href={profileData.cv.url}
            download={profileData.cv.fileName}
            type="application/pdf"
          >
            CV
          </a>
        </div>
      </div>

      {personaInfoOpen && (
        <PersonaInfoModal
          text={profileData.bio}
          onClose={() => setPersonaInfoOpen(false)}
        />
      )}
    </section>
  );
}
