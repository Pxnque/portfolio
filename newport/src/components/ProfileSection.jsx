import { useState } from "react";
import ProfileExperience from "../Experience/ProfileExperience";
import PersonaInfoModal from "./PersonaInfoModal";
import { profileData } from "../Experience/utils/profileData";
import "./ProfileSection.css";

// HTML overlay removed on purpose: Profile content is moving inside the
// canvas (TextGeometry) instead of being an HTML layer on top of it.
// profileData.js is left in place for that next step. The WORKS pill
// stays as plain HTML since it's just navigation chrome, not page content.
// PersonaInfoModal is also plain HTML/DOM (matches WORKS' INFO modal),
// triggered from inside the canvas by the Persona icon's click.
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
