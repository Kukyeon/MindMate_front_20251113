// ProfileSetupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSet.css";
import api from "../../api/axiosConfig";
import { getAccessToken } from "../../api/authApi";
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

const ProfileSetupPage = ({ setUser, user }) => {
  const navigate = useNavigate();
  // const [profile, setProfile] = useState({
  //   nickname: "",
  //   birth_date: "",
  //   mbti: "",
  // });

  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }
    try {
      const res = await api.post(
        "/api/user",
        { ...user },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const user = res.data;
      if (setUser && user) {
        setUser(user);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    }
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
              value={user.nickname}
              placeholder="닉네임"
              onChange={handleOnChange}
              className="signup-input"
              required
            />
            <button type="button" className="signup-check-btn">
              중복확인
            </button>
          </div>

          <input
            type="date"
            name="birth_date"
            value={user.birth_date}
            onChange={handleOnChange}
            className="signup-input"
            required
          />

          <select
            name="mbti"
            value={user.mbti}
            onChange={handleOnChange}
            className="signup-input"
            required
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
