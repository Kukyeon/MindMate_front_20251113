// src/context/ModalContext.js
import { createContext, useContext, useState } from "react";
import AlertModal from "../components/AlertModal";
import { useNavigate } from "react-router-dom";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);
  const [navigatePath, setNavigatePath] = useState(null);
  const showModal = (message, path = null) => {
    setModalContent(message);
    setNavigatePath(path);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalContent(null);
    if (navigatePath) {
      navigate(navigatePath, { replace: true });
      setNavigatePath(null);
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modalContent && (
        <AlertModal message={modalContent} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
};
