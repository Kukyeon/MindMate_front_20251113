import BoardItem from "./BoardItem";
import { useNavigate } from "react-router-dom";
const BoardList = ({ boards, page, size, totalElements, showAllButton }) => {
  const navigate = useNavigate();
  
  return (
    
     <div className="board-list-wrapper">
    <table className="board-table">
      <thead className="board-table-head">
        <tr>
          <th className="board-th">번호</th>
          <th className="board-th">제목</th>
          <th className="board-th">작성자</th>
          <th className="board-th">조회수</th>
          <th className="board-th">작성일</th>
        </tr>
      </thead>
      <tbody className="board-table-body">
        {boards.map((board, idx) => {
          // const reverseIndex = totalElements - (page * size + idx );

          // 관리자는 무조건 "공지" 표시
          const displayIndex = board.pinned
            ? "공지📢"
            : totalElements - (page * size + idx);
          
          return (
            <BoardItem
              key={board.id}
              board={board}
              index={displayIndex} // 최신순 번호
              isPinned={board.pinned}
            />
          );
        })}
      </tbody>    
    </table>
      {showAllButton && (
  <button
    className="board-btn back"
    onClick={() => navigate("/boards")}
  >
    전체글보기
  </button>
)}
    </div>
  );
};
export default BoardList;
