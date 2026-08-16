import ProfileExperience from "../Experience/ProfileExperience";
import "./ProfileSection.css";

// HTML overlay removed on purpose: Profile content is moving inside the
// canvas (TextGeometry) instead of being an HTML layer on top of it.
// profileData.js is left in place for that next step. The WORKS pill
// stays as plain HTML since it's just navigation chrome, not page content.
export default function ProfileSection({ onNavigateWorks }) {
  return (
    <section id="profile" className="profile-section">
      <div className="profile-canvas">
        <ProfileExperience />
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
    </section>
  );
}
