// ProfileSetupPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSet.css";
import api from "../../api/axiosConfig";
import { useModal } from "../../context/ModalContext";
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
  "ISTP",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISFP",
  "ESTP",
  "ESFP",
];

const ProfileSetupPage = ({ setUser, user }) => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [profile, setProfile] = useState({
    nickname: user?.nickname || "",
    birth_date: user?.birth_date || "",
    mbti: user?.mbti || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.profile_image_url || ""
  );

  const originalHasImage = !!user?.profile_image_url;
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

    setImagePreview(user.profile_image_url || "");
  }, [user]);

  const checkNickname = async () => {
    const nickname = profile.nickname;
    setIsNicknameOk(false);
    if (!nickname.trim()) {
      showModal("닉네임 입력후 다시 시도해주세요");
      return;
    } else if (!nicknamePattern.test(nickname)) {
      showModal(
        "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.  (한글 초성 사용불가)"
      );
      return;
    } else if (nickname.length < 3 || nickname.length > 20) {
      showModal("닉네임은 3 ~ 20글자만 입력할 수 있습니다.");
      return;
    }

    try {
      await api.get("/api/user/check_nickname", {
        params: { nickname: profile.nickname.trim() },
      });
      showModal("사용 가능한 닉네임입니다.");
      setNicknameMessage("유효한 닉네임 입니다.");
      setIsNicknameOk(true);
    } catch (err) {
      setIsNicknameOk(false);
      if (err.response && err.response.status === 409) {
        showModal("사용중인 닉네임입니다.");
        setProfile({ ...profile, nickname: "" });
      } else {
        showModal("닉네임 확인 중 오류가 발생했습니다.");
        setProfile({ ...profile, nickname: "" });
      }
    }
  };

  const handleOnChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // 이미지 타입 + 5MB 제한
    if (!file.type.startsWith("image/")) {
      showModal("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showModal("이미지 크기는 최대 5MB까지 가능합니다.");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!isNicknameOk) {
      showModal("닉네임 중복체크후 다시 시도해주세요");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    try {
      const profileRes = await api.post(
        "/api/user",
        { ...profile },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      let updatedUser = profileRes.data;

      if (imageFile) {
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const imageRes = await api.post("/api/user/profile-image", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        updatedUser = imageRes.data;
        setIsUploadingImage(false);
      } else if (!imageFile && !imagePreview && originalHasImage) {
        setIsUploadingImage(true);

        const delRes = await api.post("/api/user/profile-image/delete", null, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        updatedUser = delRes.data;
        setIsUploadingImage(false);
      }

      if (setUser && user) {
        setUser(updatedUser);
      }
      navigate("/");
    } catch (err) {
      setIsUploadingImage(false);
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        showModal("프로필설정 실패");
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
          <div className="profile-image-section">
            <div className="profile-image-preview-wrapper">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="프로필 미리보기"
                  className="profile-image-preview"
                />
              ) : (
                <div className="profile-image-placeholder">이미지 없음</div>
              )}
            </div>
            <div className="profile-image-actions">
              <label className="profile-image-upload-btn">
                이미지 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  className="profile-image-remove-btn"
                  onClick={handleImageRemove}
                >
                  제거
                </button>
              )}
              <p className="signup-help-text">
                <small>JPG, PNG 등 이미지 파일 · 최대 5MB</small>
              </p>
            </div>
          </div>

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
          <button
            type="submit"
            className="signup-button"
            disabled={isUploadingImage}
          >
            {isUploadingImage ? "저장 중..." : "완료"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
