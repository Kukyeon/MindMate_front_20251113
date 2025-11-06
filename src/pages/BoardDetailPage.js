import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteBoard, fetchBoardDetail } from "../api/boardApi";
import BoardContent from "../components/detail/BoardContent";
import CommentForm from "../components/comment/CommentForm";
import CommentList from "../components/comment/CommentList";

const BoardDetailPage = ({ accountId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  const loadBoard = async () => {
    const data = await fetchBoardDetail(id);
    setBoard(data);
  };

  useEffect(() => {
    loadBoard();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      await deleteBoard(id);
      navigate("/boards");
    }
  };

  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };

  if (!board) return <div>로딩중...</div>;

  return (
    <div>
      <BoardContent board={board} />
      <button onClick={handleEdit}> 수정 </button>
      <button onClick={handleDelete}> 삭제 </button>

      <CommentForm
        accountId={accountId}
        boardId={id}
        onCommentAdded={loadBoard}
      />
      <CommentList boardId={id} />
    </div>
  );
};
export default BoardDetailPage;
