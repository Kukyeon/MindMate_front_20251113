import { useState } from "react";
import { Link } from "react-router-dom";
import { clearAuth } from "../api/authApi";

const Header = ({ user, setUser }) => {
  const [open, setOpen] = useState(false);
  const ClickOnLogout = () => {
    clearAuth();
    setUser(null);
  };
  console.log(user);
  return (
    <header className="header">
      <div className="logo">
        <Link to={"/"}>
          {" "}
          <img src="/logo/logo.png" alt="logo" width={70} height={60} />
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
