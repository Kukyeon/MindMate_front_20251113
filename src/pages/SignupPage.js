import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./SignupPage.css";
import {
  buildGoogleAuthUrl,
  buildKakaoAuthUrl,
  buildNaverAuthUrl,
} from "../api/socialAuth";
import { getUser } from "../api/authApi";
import { requestEmailCode, startEmailStatusPolling } from "../api/emailApi";

const SignupPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    code: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [emailMessage, setEmailMessage] = useState("이메일을 입력해주세요.");
  const [isEmailChecking, setIsEmailChecking] = useState(false);

  // 폴링 중단 조건 체크용
  const emailStatusStopRef = useRef(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  useEffect(() => {
    const email = state.email.trim();

    // 이메일 바뀌면 폴링(이메일 상태체크) 중단
    if (emailStatusStopRef.current) {
      emailStatusStopRef.current();
      emailStatusStopRef.current = null;
    }

    setIsEmailChecking(false);
    setIsEmailOk(false);

    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
    } else if (!emailPattern.test(email)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
    } else if (email.length > 50) {
      setEmailMessage("이메일은 50자 이내로 입력해 주세요.");
    } else {
      setEmailMessage("이메일 중복체크를 해주세요.");
    }
  }, [state.email]);

  useEffect(() => {
    return () => {
      //
      if (emailStatusStopRef.current) {
        emailStatusStopRef.current();
      }
    };
  }, []);

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

  const [isCodeOk, setIsCodeOk] = useState(false);
  const [codeMessage, setCodeMessage] = useState(
    "이메일로 받은 인증코드를 입력해주세요."
  );

  const codePattern = /^\d{6}$/; // 6자리 숫자 예시

  useEffect(() => {
    const code = state.code.trim();
    setIsCodeOk(false);

    if (!code) {
      setCodeMessage("이메일로 받은 인증코드를 입력해주세요.");
    } else if (!codePattern.test(code)) {
      setCodeMessage("인증코드는 6자리 숫자로 입력해주세요.");
    } else {
      setCodeMessage("인증코드를 입력했습니다.");
      setIsCodeOk(true);
    }
  }, [state.code]);

  const handleOnChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const checkEmail = async () => {
    const email = state.email.trim();

    if (!email) {
      alert("이메일을 입력 후 다시 시도해주세요.");
      return;
    } else if (!emailPattern.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsEmailOk(false);

    if (emailStatusStopRef.current) {
      // 이전 폴링 중단
      emailStatusStopRef.current();
      emailStatusStopRef.current = null;
    }
    setIsEmailChecking(false);

    try {
      // 백엔드 메서드는 checkUsername 이지만, 실제 값은 이메일
      await requestEmailCode(email);

      alert("인증 코드 발송을 요청했습니다. 이메일 발송 상태를 확인 중입니다.");

      emailStatusStopRef.current = startEmailStatusPolling(email, {
        setEmailMessage,
        setIsEmailChecking,
        setIsEmailOk,
      });
    } catch (err) {
      if (emailStatusStopRef.current) {
        emailStatusStopRef.current();
        emailStatusStopRef.current = null;
      }
      setIsEmailChecking(false);
      setIsEmailOk(false);

      if (err.response && err.response.status === 409) {
        alert("이미 사용 중인 이메일입니다.");
        setState({ ...state, email: "" });
      } else if (err.response && err.response.status === 429) {
        alert(err.response.data || "요청 가능 횟수를 초과했습니다.");
      } else {
        alert("이메일 확인/코드 발급 중 오류가 발생했습니다.");
        setState({ ...state, email: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!isEmailOk) {
      alert("이메일 중복체크후 다시 시도해주세요");
      return;
    }
    if (!isPasswordOk) {
      alert("비밀번호가 유효하지 않습니다 다시 시도해주세요");
      setState({ ...state, password: "" });
      return;
    }
    if (!isCodeOk) {
      setCodeMessage("유효한 인증코드를 입력해주세요.");
      return;
    }
    try {
      const res = await api.post("/api/auth/signup", { ...state });
      localStorage.setItem("accessToken", res.data.accessToken);
      // localStorage.setItem("refreshToken", res.data.refreshToken);
      const user = await getUser();
      if (setUser && user) {
        setUser(user);
      }
      navigate("/profile/set", { replace: true });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        alert("이메일 인증코드가 틀렸거나 만료되었습니다.");
        setState((prev) => ({ ...prev, code: "" })); // 코드만 초기화
        return;
      }
      if (err.response && err.response.status === 400) {
        alert("유효하지 않은 값이 들어왔습니다 확인해주세요.");
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
              type="email"
              name="email"
              value={state.email}
              placeholder="이메일"
              onChange={handleOnChange}
              className="signup-input"
              required
            />
            <button
              type="button"
              className="signup-check-btn"
              style={{
                color: isEmailOk && "GrayText",
                backgroundColor: isEmailOk && "lightgray",
              }}
              disabled={isEmailOk}
              onClick={checkEmail}
            >
              {isEmailOk ? "체크완료" : "중복확인"}
            </button>
          </div>
          <p className="signup-help-text">
            <small>{emailMessage}</small>
          </p>
          {isEmailOk && (
            <>
              <input
                type="text"
                name="code"
                value={state.code}
                placeholder="인증코드"
                onChange={handleOnChange}
                className="signup-input"
                required
              />
              <p className="signup-help-text">
                <small>{codeMessage}</small>
              </p>
            </>
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

          <p className="signup-help-text">
            <small>{passwordMessage}</small>
          </p>
          <button type="submit" className="signup-button">
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
