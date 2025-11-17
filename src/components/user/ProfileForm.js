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
  const [isNicknameOk, setIsNicknameOk] = useState(true);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (profile.nickname === initialNickname) {
      setIsNicknameOk(true);
    } else {
      setIsNicknameOk(false);
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
    if (profile.nickname === initialNickname) {
      alert("기존 닉네임과 동일합니다.");
      return;
    }
    if (!profile.nickname.trim()) {
      alert("닉네임을 입력후 다시 시도해주세요");
      return;
    }
    try {
      await api.get("/api/user/check_nickname", {
        params: { nickname: profile.nickname.trim() },
      });
      alert("사용 가능한 닉네임입니다.");
      setIsNicknameOk(true);
    } catch (err) {
      setIsNicknameOk(false);
      if (err.response && err.response.status === 409) {
        alert("사용중인 닉네임입니다.");
      } else {
        alert("닉네임 확인 중 오류가 발생했습니다.");
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

    if (profile.nickname !== initialNickname && !isNicknameOk) {
      alert("닉네임 중복체크 후 다시 시도해주세요");
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
              disabled={isNicknameOk || profile.nickname === initialNickname}
              onClick={checkNickname}
            >
              {isNicknameOk ? "체크완료" : "중복확인"}
            </button>
          </div>
          {errors.nickname && (
            <p className="edit-profile-help-text">
              <small>{errors.nickname}</small>
            </p>
          )}
          {/* 생년월일 */}
          <input
            type="date"
            name="birth_date"
            value={profile.birth_date}
            onChange={handleChange}
            className="edit-profile-input"
            required
          />
          {errors.birth_date && (
            <p className="edit-profile-help-text">
              <small>{errors.birth_date}</small>
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
          {errors.mbti && (
            <p className="edit-profile-help-text">
              <small>{errors.mbti}</small>
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
