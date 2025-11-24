import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../api/authApi";
import api from "../api/axiosConfig";
import { useModal } from "../context/ModalContext";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [open, setOpen] = useState(false);
  const ClickOnLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await api.post("/api/auth/logout", null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }); // 백엔드에서 토큰 정리
    } catch (err) {
      console.error(err);
    } finally {
      //navigate("/", { replace: true });

      clearAuth();
      setUser(null);
      showModal("로그아웃 완료", () => {
        navigate("/", { replace: true });
      });
    }
  };
  return (
    <header className="header">
      <div className="logo">
        <Link to={"/"}>
          {" "}
          <img src="/logo.png" alt="logo" width={70} height={60} />
        </Link>
      </div>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
      <nav className={`nav ${open ? "open" : ""}`}>
        {user ? (
          <button className="logout-btn" onClick={ClickOnLogout}>
            {user.nickname} 님 로그아웃
          </button>
        ) : (
          <ul>
            <li>
              <Link to={"/login"}>로그인</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
export default Header;
