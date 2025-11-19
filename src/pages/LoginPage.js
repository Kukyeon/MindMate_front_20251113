import { Link, replace, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
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
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [emailMessage, setEmailMessage] = useState("이메일을 입력해주세요.");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    const email = state.username;
    setIsEmailOk(false);

    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
    } else if (!emailPattern.test(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
    } else if (email.length > 50) {
      setEmailMessage("이메일은 50자 이내로 입력해 주세요.");
    } else {
      setEmailMessage("유효한 이메일입니다");
      setIsEmailOk(true);
    }
  }, [state.username]);

  const [isPasswordOk, setIsPasswordOk] = useState(false);
  const [passwordMessage, setPasswordMessage] =
    useState("비밀번호를 입력해주세요");
  const passwordPattern = /^[a-zA-Z0-9]+$/;
  useEffect(() => {
    const password = state.password;
    setIsPasswordOk(false);
    if (!password) {
      setPasswordMessage("비밀번호를 입력해주세요.");
    } else if (!passwordPattern.test(password)) {
      setPasswordMessage("영어 알파벳과 숫자만 입력할 수 있습니다.");
    } else if (password.length < 8 || password.length > 16) {
      setPasswordMessage("비밀번호는 8 ~ 16글자로 입력할 수 있습니다.");
    } else {
      setPasswordMessage("유효한 비밀번호 입니다.");
      setIsPasswordOk(true);
    }
  }, [state.password]);

  const handleOnChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailOk || !isPasswordOk) {
      alert("이메일 및 비밀번호가 유효하지 않습니다");
      return;
    }
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
            type="email"
            name="username"
            value={state.username}
            placeholder="이메일"
            onChange={handleOnChange}
            className="login-input"
            required
          />
          <p className="signup-help-text">
            <small>{emailMessage}</small>
          </p>
          <input
            type="password"
            name="password"
            value={state.password}
            placeholder="비밀번호"
            onChange={handleOnChange}
            className="login-input"
            required
          />
          <p className="signup-help-text">
            <small>{passwordMessage}</small>
          </p>
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
            <p className="signup-link">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="signup-text">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
