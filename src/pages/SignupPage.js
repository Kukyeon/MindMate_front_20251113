import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

import { isDisabled } from "@testing-library/user-event/dist/utils";

const SignupPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const [isUsername, setIsUsername] = useState(false);

  const checkUsername = async (e) => {
    e.preventDefault();
    setIsUsername(false);
    try {
      const res = await api.get("/api/auth/check_username", {
        params: { username: state.username.trim() },
      });
      if (res.data) {
        setIsUsername(true);
      } else {
        alert("이미 존재하는 아이디입니다.");
        setIsUsername(false);
        setState({
          ...state,
          username: "",
        });
      }
    } catch (err) {}
  };

  const handleOnChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {

      const res = await api.post("/api/auth/signup", { ...state });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        console.error("회원가입 실패");
        alert("회원가입 실패");
      }
    }
  };
  return (
    <div>
      <h1>회원가입</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={state.username}
          placeholder="아이디"
          onChange={handleOnChange}
        />
        <button type="button" onClick={checkUsername}>
          중복확인
        </button>
        <input
          type="text"
          name="password"
          value={state.password}
          placeholder="비밀번호"
          onChange={handleOnChange}
        />
        <input
          type="number"
          name="phone"
          placeholder="휴대폰 번호(숫자만 입력)"
        />
        <button type="button">인증번호 전송</button>
        <input type="text" name="code" placeholder="인증번호 입력" />
        <hr />

        <button type="submit" disabled={isUsername ? true : false}>
          회원가입
        </button>

      </form>
    </div>
  );
};

export default SignupPage;
