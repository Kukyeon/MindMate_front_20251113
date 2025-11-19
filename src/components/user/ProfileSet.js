// ProfileSetupPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSet.css";
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
  "ISFP",
  "ESTP",
  "ESFP",
];

const ProfileSetupPage = ({ setUser, user }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    nickname: user.nickname || "",
    birth_date: user.birth_date || "",
    mbti: user.mbti || "",
  });

  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
  const [isNicknameOk, setIsNicknameOk] = useState(false);
  const [nicknameMessage, setNicknameMessage] =
    useState("닉네임을 입력해주세요.");
  const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;
  useEffect(() => {
    const nickname = profile.nickname;
    setIsNicknameOk(false);
    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요");
    } else if (!nicknamePattern.test(nickname)) {
      setNicknameMessage(
        "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.  (한글 초성 사용불가)"
      );
    } else if (nickname.length < 3 || nickname.length > 20) {
      setNicknameMessage("닉네임은 3 ~ 20글자만 입력할 수 있습니다.");
    } else {
      setNicknameMessage("닉네임 중복체크를 해주세요.");
    }
  }, [profile.nickname]);

  useEffect(() => {
    if (!user) return;
    setProfile({
      nickname: user.nickname || "",
      birth_date: user.birth_date || "",
      mbti: user.mbti || "",
    });
  }, [user]);

  const checkNickname = async () => {
    const nickname = profile.nickname;
    setIsNicknameOk(false);
    if (!nickname.trim()) {
      alert("닉네임 입력후 다시 시도해주세요");
      return;
    } else if (!nicknamePattern.test(nickname)) {
      alert(
        "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.  (한글 초성 사용불가)"
      );
      return;
    } else if (nickname.length < 3 || nickname.length > 20) {
      alert("닉네임은 3 ~ 20글자만 입력할 수 있습니다.");
      return;
    }

    try {
      await api.get("/api/user/check_nickname", {
        params: { nickname: profile.nickname.trim() },
      });
      alert("사용 가능한 닉네임입니다.");
      setNicknameMessage("유효한 닉네임 입니다.");
      setIsNicknameOk(true);
    } catch (err) {
      setIsNicknameOk(false);
      if (err.response && err.response.status === 409) {
        alert("사용중인 닉네임입니다.");
        setProfile({ ...profile, nickname: "" });
      } else {
        alert("닉네임 확인 중 오류가 발생했습니다.");
        setProfile({ ...profile, nickname: "" });
      }
    }
  };

  const handleOnChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!isNicknameOk) {
      alert("닉네임 중복체크후 다시 시도해주세요");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }
    try {
      const res = await api.post(
        "/api/user",
        { ...profile },
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
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        alert("프로필설정 실패");
        console.error(err);
      }
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
              value={profile.nickname}
              placeholder="닉네임"
              onChange={handleOnChange}
              className="signup-input"
              required
            />
            <button
              type="button"
              className="signup-check-btn"
              style={{
                color: isNicknameOk && "GrayText",
                backgroundColor: isNicknameOk && "lightgray",
              }}
              disabled={isNicknameOk}
              onClick={checkNickname}
            >
              {isNicknameOk ? "체크완료" : "중복확인"}
            </button>
          </div>

          <p className="signup-help-text">
            <small>{nicknameMessage}</small>
          </p>
          {errors.nickname && (
            <p className="signup-help-text">
              <small>{errors.nickname}</small>
            </p>
          )}
          <input
            type="date"
            name="birth_date"
            max={today}
            value={profile.birth_date}
            onChange={handleOnChange}
            className="signup-input"
            required
          />
          {!profile.birth_date && (
            <p className="signup-help-text">
              <small>"생일을 선택해주세요."</small>
            </p>
          )}
          <select
            name="mbti"
            value={profile.mbti}
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
          {!profile.mbti && (
            <p className="signup-help-text">
              <small>"MBTI를 선택해주세요."</small>
            </p>
          )}
          <button type="submit" className="signup-button">
            완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
