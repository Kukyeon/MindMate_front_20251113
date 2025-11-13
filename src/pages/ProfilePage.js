// ProfilePage.jsx
import { useState } from "react";
import Character from "../components/Character";
import ProfileForm from "../components/user/ProfileForm";
import "./ProfilePage.css";
import { useLocation } from "react-router-dom";
import MyBoards from "./MyBoards";

const ProfilePage = ({ user }) => {
  const location = useLocation(); // ✅ 라우터 state 접근
  //console.log(user.userId);
  const initialTab =
    location.state?.tab === "Character" ? "Character" : "ProfileForm"; // ✅ 기본 탭 결정
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="profile-page">
      <h1 className="profile-title">내 프로필</h1>

      <div className="profile-tabs">
        <button
          className={activeTab === "ProfileForm" ? "tab active" : "tab"}
          onClick={() => setActiveTab("ProfileForm")}
        >
          프로필 수정
        </button>
        <button
          className={activeTab === "Character" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Character")}
        >
          내 캐릭터
        </button>
        <button
          className={activeTab === "MyBoards" ? "tab active" : "tab"}
          onClick={() => setActiveTab("MyBoards")}
        >
          내 글
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "ProfileForm" && <ProfileForm />}
        {activeTab === "Character" && <Character user={user} />}
        {activeTab === "MyBoards" && <MyBoards user={user} />}
        {/* {activeTab === "Settings" && <div>⚙️ 기타 설정 영역</div>} */}
      </div>
    </div>
  );
};

export default ProfilePage;
