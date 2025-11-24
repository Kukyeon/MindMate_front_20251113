import { useEffect, useState } from "react";
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
    email: user?.email || "",
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

  // const [initialNickname, setInitialNickname] = useState(user?.nickname || "");
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
  const [isNicknameOk, setIsNicknameOk] = useState(true);
  const [nicknameMessage, setNicknameMessage] =
    useState("닉네임을 입력해주세요.");
  const nicknamePattern = /^[a-zA-Z0-9가-힣]+$/;

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const { showModal } = useModal();

  useEffect(() => {
    if (!user) return;
    setProfile({
      nickname: user.nickname || "",
      birth_date: user.birth_date || "",
      mbti: user.mbti || "",
    });
    setImagePreview(user.profile_image_url || "");
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const nickname = profile.nickname;
    setIsNicknameOk(false);

    const originalNickname = user?.nickname || "";

    if (nickname === originalNickname) {
      setNicknameMessage("");
      setIsNicknameOk(true);
    } else if (!nickname) {
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
  }, [profile.nickname, user]);

  const checkNickname = async () => {
    const originalNickname = user?.nickname || "";
    const nickname = profile.nickname;
    setIsNicknameOk(false);

    if (nickname === originalNickname) {
      setIsNicknameOk(true);
      return;
    } else if (!nickname.trim()) {
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
      if (err.response && err.response.status === 409) {
        showModal("사용중인 닉네임입니다, 기존 닉네임으로 유지됩니다.");
        setProfile({ ...profile, nickname: originalNickname });
        setIsNicknameOk(true);
      } else {
        showModal("닉네임 확인 중 오류가 발생했습니다.");
        setProfile({ ...profile, nickname: "" });
        setIsNicknameOk(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

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

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    if (!isNicknameOk) {
      showModal("닉네임 중복체크후 다시 시도해주세요");
      return;
    }

    try {
      const profileRes = await api.put(
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

      if (setUser && updatedUser) {
        setUser(updatedUser);
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

          {/* 프로필 이미지 영역 */}
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

          <div className="edit-input-group">
            <input
              type="text"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="edit-profile-input"
              readOnly
            />

          </div>
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
          <button
            type="submit"
            className="edit-profile-button"
            onClick={handleSave}
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
