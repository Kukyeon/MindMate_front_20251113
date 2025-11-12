// ProfileSetupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    birthday: "",
    mbti: "",
  });

  const handleOnChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 서버에 프로필 저장 API 호출 가능
    // await api.post("/api/user/profile", profile);

    // 완료 후 홈 페이지 이동
    navigate("/");
  };

  return (
    <div className="profile-setup-page">
      <h1>프로필 설정</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="nickname"
            value={profile.nickname}
            placeholder="닉네임"
            onChange={handleOnChange}
            className="signup-input"
          />
          <button
            type="button"
            className="signup-check-btn"
            //onClick={checkUsername}
          >
            중복확인
          </button>
        </div>
        <input
          type="text"
          name="birthday"
          placeholder="생년월일"
          value={profile.birthday}
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="mbti"
          placeholder="MBTI"
          value={profile.mbti}
          onChange={handleOnChange}
        />
        <button type="submit">완료</button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;
