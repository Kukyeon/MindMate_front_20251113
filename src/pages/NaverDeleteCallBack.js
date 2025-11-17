import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { clearAuth } from "../api/authApi";
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 토큰 키 이름 확인
  return token ? { Authorization: `Bearer ${token}` } : {};
};
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
        await api.post(
          "/api/auth/delete/naver",
          { code, state },
          { headers: getAuthHeader() }
        );

        clearAuth();
        if (setUser) setUser(null);

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
