import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearAuth } from "../api/authApi";
import { useModal } from "../context/ModalContext";
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 토큰 키 이름 확인
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const GoogleDeleteCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const calledRef = useRef(false);
  const { showModal } = useModal();

  useEffect(() => {
    // 여러 번 실행 방지
    if (calledRef.current) return;
    calledRef.current = true;

    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state"); // 구글도 state를 쓸 수 있지만, 여기서는 옵션

    if (!code) {
      showModal("구글 인가 코드가 없습니다.", "/profile");
      return;
    }

    (async () => {
      try {
        // 1) 백엔드 구글 탈퇴 API 호출
        await api.post(
          "/api/auth/delete/google",
          { code },
          { headers: getAuthHeader() }
        );

        // 2) 프론트 인증 정보 정리
        clearAuth();
        if (setUser) setUser(null);

        // 3) 탈퇴 완료 페이지로 이동
        showModal("구글 회원탈퇴가 완료되었습니다.", "/delete-complete");
      } catch (err) {
        console.error("구글 회원탈퇴 실패:", err);
        showModal("구글 회원탈퇴 중 오류가 발생했습니다.", "/profile");
      }
    })();
  }, [location.search, navigate, setUser]);

  return <div>구글 회원탈퇴 처리 중...</div>;
};

export default GoogleDeleteCallback;
