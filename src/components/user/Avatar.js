// src/components/Avatar.jsx
import { useState } from "react";
import "./Avatar.css";

const Avatar = ({ user, size = 40, onLogout, showEmail = true }) => {
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const initials = user.nickname ? user.nickname.trim()[0].toUpperCase() : "?";

  const circleStyle = {
    width: size,
    height: size,
  };

  const name = user.nickname || "User#" + user.userId;

  const toggleOpen = () => setOpen((prev) => !prev);

  const handleLogoutClick = (e) => {
    e.stopPropagation(); // 메뉴 클릭 시 아바타 토글 이벤트와 충돌 방지
    if (onLogout) onLogout();
  };

  return (
    <div className="avatar-wrapper" onClick={toggleOpen}>
      {/* 동그란 이미지/이니셜 */}
      {user.profile_image_url ? (
        <img
          src={user.profile_image_url}
          alt="프로필 이미지"
          className="avatar-img"
          style={circleStyle}
        />
      ) : (
        <div className="avatar-fallback" style={circleStyle}>
          {initials}
        </div>
      )}

      {/* 데스크톱에서만 보이는 닉네임/이메일/화살표 */}
      <div className="avatar-text desktop-only">
        <div className="avatar-name-row">
          <span className="avatar-name">{name}</span>
          <span className="avatar-label">님</span>
        </div>
        {showEmail && user.email && (
          <div className="avatar-email">{user.email}</div>
        )}
      </div>
      <div className="avatar-arrow desktop-only">{open ? "▲" : "▼"}</div>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className="avatar-menu"
          onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭으로 토글되는 것 방지
        >
          {/* PC용: 로그아웃 한 줄 */}
          <div className="avatar-menu-desktop">
            <button
              type="button"
              className="avatar-menu-item avatar-menu-item-logout"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          </div>

          {/* 모바일용: 이름/이메일 + 밑줄 + 로그아웃 버튼 */}
          <div className="avatar-menu-mobile">
            <div className="avatar-menu-user">
              <div className="avatar-menu-name">{name}</div>
              {showEmail && user.email && (
                <div className="avatar-menu-email">{user.email}</div>
              )}
            </div>
            <div className="avatar-menu-divider" />
            <button
              type="button"
              className="avatar-menu-logout-btn"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          </div>

          {/* 예전 '프로필' 메뉴 (참고용으로 주석 유지) */}
          {/*
          <div
            className="avatar-menu-item"
            onClick={() => (window.location.href = "/profile")}
          >
            프로필
          </div>
          */}
        </div>
      )}
    </div>
  );
};

export default Avatar;
