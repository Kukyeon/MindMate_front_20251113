import { useNavigate } from "react-router-dom";

const DeleteCompletePage = () => {
  const navigate = useNavigate();

  return (
    <div className="delete-complete-wrapper">
      <div className="delete-complete-card">
        <h1>회원탈퇴가 완료되었습니다.</h1>
        <p>그동안 이용해 주셔서 감사합니다.</p>
        <button onClick={() => navigate("/", { replace: true })}>
          메인으로 이동
        </button>
      </div>
    </div>
  );
};

export default DeleteCompletePage;
