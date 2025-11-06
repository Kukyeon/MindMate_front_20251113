import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { fetchBoards } from "../api/boardApi";
import BoardList from "../Components/BoardList";
import BoardSearchBar from "../components/board/BoardSearchBar";
import BoardPagination from "../components/board/BoardPagination";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const loadBoards = async () => {
    const data = await fetchBoards(page, 10, keyword);
    setBoards(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    loadBoards();
  }, [page, keyword]);

  return (
    <div>
      <h2>📝 게시판</h2>
      <BoardSearchBar keyword={keyword} onSearch={setKeyword} />
      <button onClick={() => navigate("/board/write")}>글쓰기</button>
      <BoardList boards={boards} />
      <BoardPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default BoardListPage;
