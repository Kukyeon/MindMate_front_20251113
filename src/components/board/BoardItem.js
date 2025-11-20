import { useNavigate } from "react-router-dom";

const BoardItem = ({ board, index, isPinned }) => {
  const navigate = useNavigate();

  const displayTitle =
    board.title.length > 10 ? board.title.slice(0, 10) + "…" : board.title;

  const displayIndex = board.pinned ? "공지📢" : index;
  return (
    <tr
      className={`board-item ${board.isPinned ? "board-admin" : ""}`}
      onClick={() => navigate(`/board/${board.id}`)}
    >
      <td>{displayIndex}</td>
      <td className="board-title">
        {board.pinned && "📌 "}
        {displayTitle}
        {board.commentCount > 0 && (
          <span className="board-comment">[{board.commentCount}]</span>
        )}
      </td>
      <td>
        {board.writer} {board.writerRole === "ADMIN" && "(관리자)"}
      </td>
      {/* writer 사용 또는 board.nickname */}
      <td>{board.viewCount}</td>
      <td>{board.createdAt}</td>
    </tr>
  );
};

export default BoardItem;
