// ProfilePage.jsx
import { use, useState } from "react";
import Character from "../components/Character";
import ProfileForm from "../components/user/ProfileForm";
import "./ProfilePage.css";
import ProfileView from "../components/user/ProfileView";

const ProfilePage = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("ProfileView");

  return (
    <div className="profile-page">
      <h1 className="profile-title">내 프로필</h1>

      <div className="profile-tabs">
        <button
          className={activeTab === "ProfileView" ? "tab active" : "tab"}
          onClick={() => setActiveTab("ProfileView")}
        >
          프로필
        </button>
        <button
          className={activeTab === "Character" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Character")}
        >
          내 캐릭터
        </button>
        <button
          className={activeTab === "Settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Settings")}
        >
          기타
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "ProfileView" && (
          <ProfileView setActiveTab={setActiveTab} user={user} />
        )}
        {activeTab === "ProfileForm" && (
          <ProfileForm
            setActiveTab={setActiveTab}
            setUser={setUser}
            user={user}
          />
        )}
        {activeTab === "Character" && <Character user={user} />}
        {activeTab === "Settings" && <div>⚙️ 기타 설정 영역</div>}
      </div>
    </div>
  );
};

export default ProfilePage;
