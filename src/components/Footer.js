import { Link } from "react-router-dom";

const Footer = ({ user }) => {
  return (
    <footer className="footer-nav">
      {user ? (
        <>
          {" "}
          <Link to="/">
            <span className="icon">🏠</span>
            <span className="text">홈</span>
          </Link>
          <Link to="/boards">
            <span className="icon">👥</span>
            <span className="text">커뮤니티</span>
          </Link>
          {/* <Link to="/diary">
            <span className="icon">✏️</span>
            <span className="text">일기</span>
          </Link> */}
          <Link to="/graph">
            <span className="icon">📊</span>
            <span className="text">통계</span>
          </Link>
          <Link to="/daily">
            <span className="icon">🔮</span>
            <span className="text">테스트</span>
          </Link>
          <Link to="/profile">
            <span className="icon">⚙️</span>
            <span className="text">프로필</span>
          </Link>
        </>
      ) : (
        <>
          {" "}
          <Link to="/">
            <span className="icon">🏠</span>
            <span className="text">홈</span>
          </Link>
          <Link to="/boards">
            <span className="icon">👥</span>
            <span className="text">커뮤니티</span>
          </Link>
        </>
      )}
    </footer>
  );
};
export default Footer;
