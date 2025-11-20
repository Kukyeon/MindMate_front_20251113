import { useEffect } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser, saveAuth } from "../api/authApi";
import { handleSocialLoginError } from "../api/socialErrorHandler";

const KakaoCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/auth/login/kakao", {
          params: { code },
        });

        const accessToken = res.data.accessToken;
        // const refreshToken = res.data.refreshToken;

        // saveAuth({ accessToken, refreshToken });
        saveAuth({ accessToken });

        console.log("kakao res:", res.data);
        console.log("after saveAuth:", {
          access: localStorage.getItem("accessToken"),
          // refresh: localStorage.getItem("refreshToken"),
        });

        const user = await getUser();
        if (setUser && user) {
          setUser(user);
        }

        if (!user.nickname) {
          navigate("/profile", { replace: true }); // 소셜 첫 가입 → 프로필 설정
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        handleSocialLoginError(err, navigate);
      }
    })();
  }, [location.search, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
