// src/context/ModalContext.js
import { createContext, useContext, useState } from "react";
import AlertModal from "../components/AlertModal";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
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
      window.location.href = navigatePath;
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
