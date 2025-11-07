import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useState } from "react";

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
    // setErrors({});
    try {
      const res = await api.post("/api/auth/login", { ...state });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // setErrors(err.response.data);
      } else {
        console.error("회원가입 실패");
        alert("회원가입 실패");
      }
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={state.username}
          placeholder="아이디"
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="password"
          value={state.password}
          placeholder="비밀번호"
          onChange={handleOnChange}
        />
        <hr />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
