import { useNavigate } from "react-router-dom";

export default function FakeLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 성공했다고 가정하고 토큰을 저장
    localStorage.setItem("accessToken", "fakeToken123");

    // 로그인 후 /diary 페이지로 이동
    navigate("/diary");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>로그인 페이지 (가짜 로그인)</h2>
      <p>버튼을 누르면 임시 로그인 토큰이 저장됩니다.</p>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}