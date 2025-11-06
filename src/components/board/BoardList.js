import BoardItem from "./BoardItem";
import React from "react";

const BoardList = ({ boards }) => {
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
        {boards.map((board, idx) => (
          <BoardItem key={board.id} board={board} index={idx + 1} />
        ))}
      </tbody>
    </table>
  );
};
export default BoardList;
