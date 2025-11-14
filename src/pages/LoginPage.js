import { replace, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useState } from "react";
import "./LoginPage.css"; // 스타일 따로 분리
import { getUser, saveAuth } from "../api/authApi";
import {
  buildGoogleAuthUrl,
  buildKakaoAuthUrl,
  buildNaverAuthUrl,
} from "../api/socialAuth";

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
        navigate("/profile", { replace: true }); // 로그인시, 프로필설정이 안되면 이동
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        console.error("로그인 실패", err);
        alert(err);
      }
    }
  };

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = buildKakaoAuthUrl();
    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    const naverAuthUrl = buildNaverAuthUrl();
    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = buildGoogleAuthUrl();
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
            required
          />
          <input
            type="password"
            name="password"
            value={state.password}
            placeholder="비밀번호"
            onChange={handleOnChange}
            className="login-input"
            required
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
