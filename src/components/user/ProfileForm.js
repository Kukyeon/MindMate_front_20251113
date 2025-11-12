// EditProfile.jsx
import { useState } from "react";
import api from "../../api/axiosConfig";

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

const EditProfile = () => {
  const [profile, setProfile] = useState({
    nickname: "",
    birthday: "",
    mbti: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put("/api/user/profile", profile);
      setMessage("✅ 프로필이 저장되었습니다!");
    } catch (err) {
      console.error(err);
      setMessage("❌ 프로필 저장 실패");
    }
  };

  return (
    <div className="edit-profile-page">
      <h1 className="edit-profile-title">프로필 수정</h1>

      <div className="edit-profile-card">
        <form
          className="edit-profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* 닉네임 + 중복확인 */}
          <div className="edit-input-group">
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="닉네임"
              className="edit-profile-input"
            />
            <button type="button" className="edit-profile-check-btn">
              중복확인
            </button>
          </div>

          {/* 생년월일 */}
          <input
            type="date"
            name="birthday"
            value={profile.birthday}
            onChange={handleChange}
            className="edit-profile-input"
          />

          {/* MBTI */}
          <select
            name="mbti"
            value={profile.mbti}
            onChange={handleChange}
            className="edit-profile-input"
          >
            <option value="">MBTI 선택</option>
            {mbtiOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* 비밀번호 */}
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="새 비밀번호"
            className="edit-profile-input"
          />

          <button type="submit" className="edit-profile-button">
            저장
          </button>

          {message && <p className="edit-profile-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
