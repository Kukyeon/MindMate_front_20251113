import { useNavigate } from "react-router-dom";

const BoardItem = ({ board, index }) => {
  const navigate = useNavigate();

  return (
    <tr className="board-item" onClick={() => navigate(`/board/${board.id}`)}>
      <td>{index}</td>
      <td className="board-title">
        {board.title}
        {board.commentCount > 0 && (
          <span className="board-comment">[{board.commentCount}]</span>
        )}
      </td>
      <td>{board.writer}</td>
      <td>{board.viewCount}</td>
      <td>{new Date(board.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};

export default BoardItem;
