import BoardItem from "./BoardItem";

const BoardList = ({ boards, page, size, totalElements }) => {
  return (
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
            ? "공지"
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
  );
};
export default BoardList;
