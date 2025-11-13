import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const ProfileView = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  // const formatDate = (dateStr) => {
  //   if (!dateStr) return "-";
  //   const date = new Date(dateStr);
  //   if (Number.isNaN(date.getTime())) return dateStr; // 이미 yyyy-MM-dd 형태면 그대로
  //   return date.toLocaleDateString("ko-KR");
  // };

  // useEffect(() => {
  //   if (!user) {
  //     alert("유저정보가 없습니다.");
  //   }

  //   fetchProfile();
  // }, []);

  if (error) {
    return (
      <div className="edit-profile-page">
        <h1 className="edit-profile-title">내 프로필</h1>
        <div className="edit-profile-card">
          <p className="edit-profile-message error">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="edit-profile-page">
        <h1 className="edit-profile-title">내 프로필</h1>
        <div className="edit-profile-card">
          <p className="edit-profile-message">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <h1 className="edit-profile-title">내 프로필</h1>

      <div className="edit-profile-card">
        <div className="profile-view">
          {/* 닉네임 */}
          <div className="profile-view-row">
            <span className="profile-view-label">닉네임</span>
            <span className="profile-view-value">{user.nickname || "-"}</span>
          </div>

          {/* 생년월일 */}
          <div className="profile-view-row">
            <span className="profile-view-label">생년월일:</span>
            <span className="profile-view-value">{user.birth_date}</span>
          </div>

          {/* MBTI */}
          <div className="profile-view-row">
            <span className="profile-view-label">MBTI</span>
            <span className="profile-view-value">{user.mbti || "미등록"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
