import { useNavigate } from "react-router-dom";

const BoardItem = ({ board, index }) => {
  const navigate = useNavigate();
  const displayTitle =
    board.title.length > 10 ? board.title.slice(0, 10) + "…" : board.title;
  return (
    <tr className="board-item" onClick={() => navigate(`/board/${board.id}`)}>
      <td>{index}</td>
      <td className="board-title">
        {displayTitle}
        {board.commentCount > 0 && (
          <span className="board-comment">[{board.commentCount}]</span>
        )}
      </td>
      <td>{board.writer}</td> {/* writer 사용 또는 board.nickname */}
      <td>{board.viewCount}</td>
      <td>{new Date(board.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};

export default BoardItem;
