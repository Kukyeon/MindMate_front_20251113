import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useState } from "react";
import "./LoginPage.css"; // 스타일 따로 분리

const LoginPage = () => {
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
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/");
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
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">오늘의 마음을 기록해보세요 💖</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            value={state.username}
            placeholder="이메일"
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
              onClick={() => handleSocialLogin("Google")}
            >
              <img
                src="/logo/googleIn.png"
                alt="Google"
                className="social-icon"
              />
            </button>
            <button
              className="social-button kakao"
              onClick={() => handleSocialLogin("Kakao")}
            >
              <img src="/logo/kakao.png" alt="Kakao" className="social-icon" />
            </button>
            <button
              className="social-button naver"
              onClick={() => handleSocialLogin("Naver")}
            >
              <img src="/logo/naver.png" alt="Naver" className="social-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
