import React from "react";
import "./AlertModal.css"; // 기존 CSS 그대로 사용

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const stop = (e) => e.stopPropagation();

  return (
    <div className="custom-modal-backdrop is-open" onClick={onCancel}>
      <div className="custom-alert-box" onClick={stop}>
        <div className="alert-content">{message}</div>
        <div className="confirm-buttons">
          <button className="alert-confirm-btn" onClick={onConfirm}>
            확인
          </button>
          <button className="alert-cancel-btn" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
