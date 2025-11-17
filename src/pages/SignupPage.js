import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./SignupPage.css";
import {
  buildGoogleAuthUrl,
  buildKakaoAuthUrl,
  buildNaverAuthUrl,
} from "../api/socialAuth";
import { getUser } from "../api/authApi";

const SignupPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isUsernameOk, setIsUsernameOk] = useState(false);

  const handleOnChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setIsUsernameOk(false);
  }, [state.username]);

  const checkUsername = async () => {
    const usernamePattern = "^[a-zA-Z0-9]*$";
    if (!state.username) {
      alert("아이디를 입력후 다시 시도해주세요");
      return;
    }

    if (username) setIsUsernameOk(false);
    try {
      await api.get("/api/auth/check_username", {
        params: { username: state.username.trim() },
      });
      alert("사용 가능한 아이디입니다.");

      setIsUsernameOk(true);
    } catch (err) {
      setIsUsernameOk(false);
      if (err.response && err.response.status === 409) {
        alert("사용중인 아이디입니다.");
      } else {
        alert("아이디 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!isUsernameOk) {
      alert("아이디 중복체크후 다시 시도해주세요");
      return;
    }
    try {
      const res = await api.post("/api/auth/signup", { ...state });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      const user = await getUser();
      if (setUser && user) {
        setUser(user);
      }
      navigate("/profile/set", { replace: true });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        alert("회원가입 실패");
        console.error(err);
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
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>
        <p className="signup-subtitle">
          오늘부터 나만의 감정을 기록해보세요 🌸
        </p>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={state.username}
              placeholder="아이디"
              onChange={handleOnChange}
              className="signup-input"
              required
            />
            <button
              type="button"
              className="signup-check-btn"
              style={{
                color: isUsernameOk && "GrayText",
                backgroundColor: isUsernameOk && "lightgray",
              }}
              disabled={isUsernameOk}
              onClick={checkUsername}
            >
              {isUsernameOk ? "체크완료" : "중복확인"}
            </button>
          </div>
          {!isUsernameOk && (
            <p className="signup-help-text">
              <small>아이디 중복체크를 해주세요.</small>
            </p>
          )}
          {errors.username && (
            <p className="signup-help-text">
              <small>{errors.username}</small>
            </p>
          )}

          <input
            type="password"
            name="password"
            value={state.password}
            placeholder="비밀번호"
            onChange={handleOnChange}
            className="signup-input"
            required
          />
          {errors.password && (
            <p className="signup-help-text">
              <small>{errors.password}</small>
            </p>
          )}
          <button
            type="submit"
            className="signup-button"
            // disabled={!isUsernameOk}
          >
            회원가입
          </button>
        </form>

        {/* 간편회원가입 */}
        <div className="social-login">
          <p>또는 간편 회원가입</p>
          <div className="social-buttons">
            <button
              className="social-button google"
              onClick={handleGoogleLogin}
            >
              <img
                src="/logo/googleUp.png"
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

export default SignupPage;
