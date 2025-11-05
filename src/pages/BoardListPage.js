import { Component } from "react";
import BoardSearchBar from "../Components/BoardSearchBar";

const BoardListPage = () => {
  return (
    <div>
      <h2>📝 게시판</h2>
      <BoardSearchBar keyword={keyword} />
    </div>
  );
};
