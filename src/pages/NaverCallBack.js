import { useEffect } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser, saveAuth } from "../api/authApi";

const NaverCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state"); // 네이버는 state를 추가로 요청

    if (!code || !state) {
      alert("네이버 인가 코드 또는 state 값이 없습니다.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/auth/naver/login", {
          params: { code, state },
        });

        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;

        saveAuth({ accessToken, refreshToken });
        console.log("naver res:", res.data);
        console.log("after saveAuth:", {
          access: localStorage.getItem("accessToken"),
          refresh: localStorage.getItem("refreshToken"),
        });

        const user = await getUser();
        if (setUser && user) {
          setUser(user);
        }

        if (!user.nickname) {
          navigate("/profile", replace); // 소셜 첫 가입 → 프로필 설정
        } else {
          navigate("/", replace);
        }
      } catch (err) {
        console.error("네이버 로그인 실패:", err);
        alert("네이버 로그인 실패");
        navigate("/login");
      }
    })();
  }, [location.search, navigate, setUser]);

  return <div>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;
