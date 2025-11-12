import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser, saveAuth } from "../api/authApi";

const KakaoCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/auth/kakao/login", {
          params: { code },
        });

        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;

        saveAuth({ accessToken, refreshToken });
        console.log("kakao res:", res.data);
        console.log("after saveAuth:", {
          access: localStorage.getItem("accessToken"),
          refresh: localStorage.getItem("refreshToken"),
        });

        const user = await getUser();
        if (setUser && user) {
          setUser(user);
        }

        // if (!user.nickname) {
        //   // 닉네임이 없으면 프로필이 설정 되지 않음으로 정의
        //   navigate("/profile"); // 소셜로 첫 회원가입 후 프로필설정
        // } else {
        //   navigate("/");
        // }
        navigate("/");
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        alert("카카오 로그인 실패");
        navigate("/login");
      }
    })();
  }, [location.search, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
