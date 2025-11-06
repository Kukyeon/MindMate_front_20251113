import { useNavigate } from "react-router-dom";

const BoardItem = ({ board, index }) => {
  const navigate = useNavigate();
  return (
    <tr
      onClick={() => navigate(`/board/${board.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{index}</td>
      <td>
        {board.title}
        {board.commentCount > 0 && <span>[{board.commentCount}]</span>}
      </td>
      <td>{board.writer}</td>
      <td>{board.viewCount}</td>
      <td>{new Date(board.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};
export default BoardItem;
