import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./SignupPage.css";

const SignupPage = () => {
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

  const checkUsername = async () => {
    try {
      const res = await api.get("/api/auth/check_username", {
        params: { username: state.username.trim() },
      });
      if (res.data) {
        setIsUsernameOk(true);
        alert("사용 가능한 아이디입니다!");
      } else {
        setIsUsernameOk(false);
        alert("이미 존재하는 아이디입니다.");
      }
    } catch (err) {
      alert("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const res = await api.post("/api/auth/signup", { ...state });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/profile/set");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        alert("회원가입 실패");
      }
    }
  };

  const handleSocialSignup = (provider) => {
    alert(`${provider} 회원가입 구현 필요`);
    // 실제 구현 시 OAuth API 호출
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
              type="email"
              name="username"
              value={state.username}
              placeholder="이메일"
              onChange={handleOnChange}
              className="signup-input"
            />
            <button
              type="button"
              className="signup-check-btn"
              onClick={checkUsername}
            >
              중복확인
            </button>
          </div>

          <input
            type="password"
            name="password"
            value={state.password}
            placeholder="비밀번호"
            onChange={handleOnChange}
            className="signup-input"
          />

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
              onClick={() => handleSocialSignup("Google")}
            >
              <img
                src="/logo/googleUp.png"
                alt="Google"
                className="social-icon"
              />
            </button>
            <button
              className="social-button kakao"
              onClick={() => handleSocialSignup("Kakao")}
            >
              <img src="/logo/kakao.png" alt="Kakao" className="social-icon" />
            </button>
            <button
              className="social-button naver"
              onClick={() => handleSocialSignup("Naver")}
            >
              <img src="/logo/naver.png" alt="Naver" className="social-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
