// ProfileSetupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSet.css";
const mbtiOptions = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nickname: "",
    birthday: "",
    mbti: "",
  });

  const handleOnChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 서버에 프로필 저장 API 호출 가능
    // await api.post("/api/user/profile", profile);

    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">프로필 설정</h1>
        <p className="signup-subtitle">기본 정보를 입력해주세요</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              placeholder="닉네임"
              onChange={handleOnChange}
              className="signup-input"
            />
            <button type="button" className="signup-check-btn">
              중복확인
            </button>
          </div>

          <input
            type="date"
            name="birthday"
            value={profile.birthday}
            onChange={handleOnChange}
            className="signup-input"
          />

          <select
            name="mbti"
            value={profile.mbti}
            onChange={handleOnChange}
            className="signup-input"
          >
            <option value="">MBTI 선택</option>
            {mbtiOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button type="submit" className="signup-button">
            완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
