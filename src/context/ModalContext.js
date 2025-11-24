// src/context/ModalContext.js
import { createContext, useContext, useEffect, useState } from "react";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const [navigatePath, setNavigatePath] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const showModal = (message, path = null) => {
    setAlertMessage(message);
    setNavigatePath(path);
  };

  // 모달 닫기
  const closeModal = () => {
    setAlertMessage(null); // 모달 닫기만
  };
  const showConfirm = (message, onConfirm, onCancel) => {
    setConfirmState({ message, onConfirm, onCancel });
  };
  const closeConfirm = () => {
    if (confirmState?.onCancel) confirmState.onCancel();
    setConfirmState(null);
  };
  // 모달이 닫힌 후 navigate 실행
  useEffect(() => {
    if (!alertMessage && navigatePath) {
      navigate(navigatePath, { replace: true });
      setNavigatePath(null);
    }
  }, [alertMessage, navigatePath, navigate]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal, showConfirm }}>
      {children}
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={closeModal} />
      )}
      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={() => {
            confirmState.onConfirm?.();
            setConfirmState(null);
          }}
          onCancel={closeConfirm}
        />
      )}
    </ModalContext.Provider>
  );
};
