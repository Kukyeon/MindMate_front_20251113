// EditProfile.jsx
import { useState } from "react";
import api from "../../api/axiosConfig";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    nickname: "",
    bio: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // 실제로는 백엔드 API 호출
      const res = await api.put("/api/user/profile", profile);
      setMessage("✅ 프로필이 저장되었습니다!");
    } catch (err) {
      console.error(err);
      setMessage("❌ 프로필 저장 실패");
    }
  };

  return (
    <div className="edit-profile-card">
      <div className="input-group">
        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          value={profile.nickname}
          onChange={handleChange}
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <div className="input-group">
        <label>자기소개</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="간단한 자기소개를 작성하세요"
          rows={4}
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        저장
      </button>

      {message && <p className="save-message">{message}</p>}
    </div>
  );
};

export default EditProfile;
