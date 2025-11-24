import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { clearAuth } from "../../api/authApi";
import {
  buildGoogleDeleteAuthUrl,
  buildKakaoDeleteAuthUrl,
  buildNaverDeleteAuthUrl,
} from "../../api/socialAuth";
import { useModal } from "../../context/ModalContext";
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 토큰 키 이름 확인
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// ProfileView.jsx
const ProfileView = ({ setUser, user, setActiveTab }) => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n모든 데이터가 삭제될 수 있습니다."
    );
    if (!ok) return;

    const authType = user.authType;

    // 1) 소셜 계정인 경우: 각 provider 삭제용 OAuth 플로우 시작 (리다이렉트)
    if (authType === "KAKAO") {
      window.location.href = buildKakaoDeleteAuthUrl();
      return;
    }

    if (authType === "NAVER") {
      window.location.href = buildNaverDeleteAuthUrl();
      return;
    }

    if (authType === "GOOGLE") {
      window.location.href = buildGoogleDeleteAuthUrl();
      return;
    }

    // 2) 일반 계정인 경우: 우리 백엔드 탈퇴 API 바로 호출
    try {
      await api.post("/api/auth/delete", null, { headers: getAuthHeader() }); // 필요하면 경로 수정

      clearAuth();
      if (setUser) setUser(null);

      navigate("/delete-complete", { replace: true });
    } catch (err) {
      console.error("회원탈퇴 실패:", err);
      showModal("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  if (!user) {
    return (
      <div className="edit-profile-page">
        <h1 className="edit-profile-title">내 프로필</h1>
        <div className="edit-profile-card">
          <p className="edit-profile-message">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <h1 className="edit-profile-title">내 프로필</h1>

      <div className="edit-profile-card">
        {/* 폼 레이아웃 재사용 */}
        {/* 프로필 이미지 */}
        <div className="edit-profile-form profile-view">
          <div className="profile-image-section">
            <div className="profile-image-preview-wrapper">
              {user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt="프로필 이미지"
                  className="profile-image-preview"
                />
              ) : (
                <div className="profile-image-placeholder">이미지 없음</div>
              )}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="profile-view-row">
            <div className="profile-view-label">닉네임</div>
            <div className="profile-view-value">{user.nickname || "-"}</div>
          </div>

          {/* 생년월일 */}
          <div className="profile-view-row">
            <div className="profile-view-label">생년월일</div>
            <div className="profile-view-value">{user.birth_date}</div>
          </div>

          {/* MBTI */}
          <div className="profile-view-row">
            <div className="profile-view-label">MBTI</div>
            <div className="profile-view-value">{user.mbti || "미등록"}</div>
          </div>

          {/* 버튼 영역 */}
          <div className="profile-view-actions">
            <button
              type="button"
              className="edit-profile-button"
              onClick={() => setActiveTab("ProfileForm")}
            >
              프로필 수정
            </button>

            <button
              type="button"
              className="edit-profile-delete-btn"
              onClick={handleDeleteAccount}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
