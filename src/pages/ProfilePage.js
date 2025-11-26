// ProfilePage.jsx
import { useState } from "react";
import Character from "../components/Character";
import ProfileForm from "../components/user/ProfileForm";
import ProfileView from "../components/user/ProfileView";
import MyBoards from "./MyBoards";
import FontSelector from "../components/FontSelector";
import { useLocation } from "react-router-dom";
import "./ProfilePage.css"; // 통합 CSS 사용

const ProfilePage = ({ user, setUser }) => {
  const location = useLocation();
  const initialTab =
    location.state?.tab === "Character" ? "Character" : "ProfileView";
  const [activeTab, setActiveTab] = useState(initialTab);

  //폰트
  const [showFontPopup, setShowFontPopup] = useState(false);

  return (
    <div className="page-container">
      <h1 className="page-title">내 프로필</h1>

      <div className="tabs-container profile-tabs">
        <button
          className={
            activeTab === "ProfileView" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("ProfileView")}
        >
          프로필
        </button>
        <button
          className={
            activeTab === "Character" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("Character")}
        >
          내 캐릭터
        </button>
        <button
          className={
            activeTab === "MyBoards" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("MyBoards")}
        >
          내 글
        </button>

        {/* 폰트 변경 버튼 */}
        <button
          className="tab-button font-btn"
          onClick={() => setShowFontPopup(true)}
        >
          글꼴 변경
        </button>
      </div>
      {showFontPopup && <FontSelector close={() => setShowFontPopup(false)} />}

      <div className="tab-content">
        {activeTab === "ProfileView" && (
          <div className="card">
            <ProfileView
              setUser={setUser}
              setActiveTab={setActiveTab}
              user={user}
            />
          </div>
        )}
        {activeTab === "ProfileForm" && (
          <div className="card">
            <ProfileForm
              setActiveTab={setActiveTab}
              setUser={setUser}
              user={user}
            />
          </div>
        )}
        {activeTab === "Character" && (
          <div className="card">
            <Character user={user} />
          </div>
        )}
        {activeTab === "MyBoards" && (
          <div className="card">
            <MyBoards user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
