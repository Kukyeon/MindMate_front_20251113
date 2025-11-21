import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../api/authApi";
import api from "../api/axiosConfig";
import Avatar from "./user/Avatar";
const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
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
      navigate("/", { replace: true });
      clearAuth();
      setUser(null);
      return;
    }
  };
  console.log(user);
  return (
    <header className="header">
      <div className="logo">
        <Link to={"/"}>
          {" "}
          <img src="/logo.png" alt="logo" width={70} height={60} />
        </Link>
      </div>
      {/* ======= 로그인 한 경우: 오른쪽에 Avatar만 ======= */}
      {user ? (
        <div className="header-right">
          {/* Avatar 안에서 드롭다운/로그아웃 처리 (onLogout 전달) */}
          <Avatar user={user} size={32} onLogout={ClickOnLogout} />
        </div>
      ) : (
        <>
          {/* ======= 비로그인(guest)일 때만 햄버거 + nav 사용 ======= */}
          <div className="hamburger" onClick={() => setOpen(!open)}>
            ☰
          </div>
          <nav className={`nav ${open ? "open" : ""}`}>
            <ul>
              <li>
                <Link to={"/login"}>로그인</Link>
              </li>
            </ul>
          </nav>
        </>
      )}
      {/*
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
      <nav className={`nav ${open ? "open" : ""}`}>
        {user ? (
          <div className="header-user">
            <Avatar user={user} size={32} onLogout={ClickOnLogout} />

             <button className="logout-btn" onClick={ClickOnLogout}>
              로그아웃
            </button> 
          </div>
        ) : (
          <ul>
            <li>
              <Link to={"/login"}>로그인</Link>
            </li>
          </ul>
        )}
      </nav>
      */}
    </header>
  );
};
export default Header;
