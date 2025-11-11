import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="일기 작성" width={70} height={60} />
      </div>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
      <nav className={`nav ${open ? "open" : ""}`}>
        <ul>
          <li>
            <Link to={"/login"}>로그인</Link>
          </li>
          <li>
            <Link to={"/signup"}>회원가입</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
