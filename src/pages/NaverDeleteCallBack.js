import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearAuth } from "../api/authApi";

const NaverDeleteCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const calledRef = useRef(false);
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state"); // 네이버는 state 필수

    if (!code || !state) {
      alert("네이버 인가 코드 또는 state 값이 없습니다.");
      navigate("/profile", { replace: true });
      return;
    }

    (async () => {
      try {
        // 🔹 여기서 백엔드 탈퇴 API 호출
        // 경로는 백엔드에서 구현한 엔드포인트에 맞게 수정해줘
        await api.post("/api/auth/naver/delete", { code, state });

        // 🔹 프론트 인증 정보 정리
        clearAuth();
        if (setUser) setUser(null);

        // 🔹 탈퇴 완료 페이지로 이동
        navigate("/delete-complete", { replace: true });
      } catch (err) {
        console.error("네이버 회원탈퇴 실패:", err);
        alert("네이버 회원탈퇴 중 오류가 발생했습니다.");
        navigate("/profile", { replace: true });
      }
    })();
  }, [location.search, navigate, setUser]);

  return <div>네이버 회원탈퇴 처리 중...</div>;
};

export default NaverDeleteCallback;
