// AlertModal.jsx
import React from "react";
import "./AlertModal.css";

const AlertModal = ({ message, onClose }) => {
  // 클릭 전파 막기
  const stop = (e) => e.stopPropagation();

  return (
    <div className="custom-modal-backdrop is-open" onClick={stop}>
      <div className="custom-alert-box" onClick={stop}>
        <div className="alert-content">{message}</div>
        <button className="alert-confirm-btn" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
