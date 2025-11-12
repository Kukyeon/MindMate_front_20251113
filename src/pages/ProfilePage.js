// ProfilePage.jsx
import { useState } from "react";
import Character from "../components/Character";
import ProfileForm from "../components/user/ProfileForm";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Edit");

  return (
    <div className="profile-page">
      <h1 className="profile-title">내 프로필</h1>

      <div className="profile-tabs">
        <button
          className={activeTab === "ProfilForm" ? "tab active" : "tab"}
          onClick={() => setActiveTab("ProfileForm")}
        >
          수정
        </button>
        <button
          className={activeTab === "Character" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Character")}
        >
          캐릭터
        </button>
        <button
          className={activeTab === "Settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Settings")}
        >
          기타
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "ProfileForm" && <ProfileForm />}
        {activeTab === "Character" && <Character />}
        {activeTab === "Settings" && <div>⚙️ 기타 설정 영역</div>}
      </div>
    </div>
  );
};

export default ProfilePage;
