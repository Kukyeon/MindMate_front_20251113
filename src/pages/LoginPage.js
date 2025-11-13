import { replace, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useState } from "react";
import "./LoginPage.css"; // 스타일 따로 분리
import { getUser, saveAuth } from "../api/authApi";

const KAKAO_REST_API_KEY = "d032aea47f7cde0d9d176389f15a4053"; // 프론트에 노출돼도 되는 키
const KAKAO_REDIRECT_URI = "http://localhost:3000/auth/kakao/callback"; // 카카오 콘솔 + 백엔드 설정과 맞출 것

const NAVER_CLIENT_ID = "ca5VSclizDaIGPg981EJ";
const NAVER_REDIRECT_URI = "http://localhost:3000/auth/naver/callback";

const GOOGLE_CLIENT_ID =
  "866215417194-hsrr4k4h24rku7ng7le4rvnq8s9dqviv.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_SCOPE = "openid";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { ...state });
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;

      saveAuth({ accessToken, refreshToken });

      const user = await getUser();
      if (setUser && user) {
        setUser(user);
      }
      if (!user.nickname) {
        // 닉네임이 없으면 프로필이 설정 되지 않음으로 정의
        navigate("/profile", replace); // 로그인시, 프로필설정이 안되면 이동
      } else {
        navigate("/", replace);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      } else {
        console.error("로그인 실패", err);
        alert("로그인 실패");
      }
    }
  };
  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인 구현 필요`);
    // 실제로는 OAuth API 호출
  };

  const handleKakaoLogin = () => {
    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(KAKAO_REST_API_KEY)}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;

    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    const state = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).substring(2, 14);

    const naverAuthUrl =
      "https://nid.naver.com/oauth2.0/authorize" +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(NAVER_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = () => {
    const state = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).substring(2, 14);

    sessionStorage.setItem("google_oauth_state", state);

    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(GOOGLE_SCOPE)}` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">오늘의 마음을 기록해보세요 💖</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="username"
            name="username"
            value={state.username}
            placeholder="아이디"
            onChange={handleOnChange}
            className="login-input"
          />
          <input
            type="password"
            name="password"
            value={state.password}
            placeholder="비밀번호"
            onChange={handleOnChange}
            className="login-input"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <div className="social-login">
          <p>또는 간편 로그인</p>
          <div className="social-buttons">
            <button
              className="social-button google"
              onClick={handleGoogleLogin}
            >
              <img
                src="/logo/googleIn.png"
                alt="Google"
                className="social-icon"
              />
            </button>
            <button className="social-button kakao" onClick={handleKakaoLogin}>
              <img src="/logo/kakao.png" alt="Kakao" className="social-icon" />
            </button>
            <button className="social-button naver" onClick={handleNaverLogin}>
              <img src="/logo/naver.png" alt="Naver" className="social-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
