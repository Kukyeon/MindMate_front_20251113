// EditProfile.jsx
import { useEffect, useState } from "react";
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

const EditProfile = ({ setUser, user, setActiveTab }) => {
  const [profile, setProfile] = useState({
    nickname: user?.nickname || "",
    birth_date: user?.birth_date || "",
    mbti: user?.mbti || "",
  });

  const [initialNickname] = useState(user?.nickname || "");
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
  const [isNicknameOk, setIsNicknameOk] = useState(false);
  const [nicknameMessage, setNicknameMessage] =
    useState("닉네임을 입력해주세요.");
  const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const nickname = profile.nickname;
    setIsNicknameOk(false);
    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요");
    } else if (nickname === initialNickname) {
      setNicknameMessage("기존 닉네임과 동일합니다.");
    } else if (!nicknamePattern.test(nickname)) {
      setNicknameMessage(
        "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.  (한글 초성 사용불가)"
      );
    } else if (nickname.length < 3 || nickname.length > 20) {
      setNicknameMessage("닉네임은 3 ~ 20글자만 입력할 수 있습니다.");
    } else {
      setNicknameMessage("닉네임 중복체크를 해주세요.");
    }
  }, [profile.nickname, initialNickname]);

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
    if (nickname === initialNickname) {
      alert("기존 닉네임과 동일합니다.");
      return;
    } else if (!nickname.trim()) {
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

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    if (!isNicknameOk) {
      alert("닉네임 중복체크후 다시 시도해주세요");
      return;
    }

    try {
      const res = await api.put(
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
      setMessage("✅ 프로필이 저장되었습니다!");
      setActiveTab("ProfileView");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        // 백엔드에서 필드별 에러 내려줄 때
        setErrors(err.response.data);
        setMessage("❌ 입력값을 다시 확인해주세요.");
      } else {
        setMessage("❌ 프로필 저장 실패");
      }
    }
  };

  return (
    <div className="edit-profile-page">
      <h1 className="edit-profile-title">프로필 수정</h1>

      <div className="edit-profile-card">
        <form className="edit-profile-form" onSubmit={handleSave}>
          {/* 닉네임 + 중복확인 */}
          <div className="edit-input-group">
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="닉네임"
              className="edit-profile-input"
              required
            />
            <button
              type="button"
              className="edit-profile-check-btn"
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

          {/* 생년월일 */}
          <input
            type="date"
            name="birth_date"
            value={profile.birth_date}
            onChange={handleChange}
            className="edit-profile-input"
            max={today}
            required
          />
          {!profile.birth_date && (
            <p className="signup-help-text">
              <small>"생일을 선택해주세요."</small>
            </p>
          )}
          {/* MBTI */}
          <select
            name="mbti"
            value={profile.mbti}
            onChange={handleChange}
            className="edit-profile-input"
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
          {/* 비밀번호 */}
          {/* <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="새 비밀번호"
            className="edit-profile-input"
          /> */}

          <button
            type="submit"
            className="edit-profile-button"
            onClick={handleSave}
          >
            저장
          </button>

          {/* {message && <p className="edit-profile-message">{message}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
