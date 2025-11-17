// src/pages/KakaoDeleteCallback.js
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearAuth } from "../api/authApi";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 토큰 키 이름 확인
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const KakaoDeleteCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    // 여러 번 실행 방지
    if (calledRef.current) return;
    calledRef.current = true;

    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state"); // 카카오도 state 오긴 하는데, 필수는 아님 (옵션)

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/profile", { replace: true });
      return;
    }

    (async () => {
      try {
        // 1) 백엔드 카카오 탈퇴 API 호출
        await api.post(
          "/api/auth/delete/kakao",
          { code },
          { headers: getAuthHeader() }
        );

        // 2) 프론트 인증 정보 정리
        clearAuth();
        if (setUser) setUser(null);

        // 3) 탈퇴 완료 페이지로 이동
        navigate("/delete-complete", { replace: true });
      } catch (err) {
        console.error("카카오 회원탈퇴 실패:", err);
        alert("카카오 회원탈퇴 중 오류가 발생했습니다.");
        navigate("/profile", { replace: true });
      }
    })();
  }, [location.search, navigate, setUser]);

  return <div>카카오 회원탈퇴 처리 중...</div>;
};

export default KakaoDeleteCallback;
