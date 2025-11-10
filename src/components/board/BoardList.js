import BoardItem from "./BoardItem";

const BoardList = ({ boards, page, size, totalElements }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>조회수</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {boards.map((board, idx) => {
          const reverseIndex = totalElements - (page * size + idx);
          return (
            <BoardItem
              key={board.id}
              board={board}
              index={reverseIndex} //  최신순 번호
            />
          );
        })}
      </tbody>
    </table>
  );
};
export default BoardList;
