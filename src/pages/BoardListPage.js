import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoards } from "../api/boardApi";
import BoardSearchBar from "../components/board/BoardSearchBar";
import BoardPagination from "../components/board/BoardPagination";
import BoardList from "../components/board/BoardList";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState({ field: "title", keyword: "" });
  const navigate = useNavigate();

  const loadBoards = useCallback(async () => {
    try {
      const data = await fetchBoards(page, 10, search);
      if (data && data.content) {
        setBoards(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements); //  총 게시글 수 저장
      }
    } catch (err) {
      console.error("게시글 목록 불러오기 실패:", err);
    }
  }, [page, search]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return (
    <div>
      <h2>📝 게시판</h2>

      <BoardSearchBar
        keyword={search.keyword}
        condition={search.field}
        onSearch={setSearch}
      />

      <button onClick={() => navigate("/board/write")}>글쓰기</button>

      {Array.isArray(boards) && boards.length > 0 ? (
        <BoardList
          boards={boards}
          page={page}
          size={10}
          totalElements={totalElements} // 여기에 data.totalElements 대신
        />
      ) : (
        <p>게시글이 없습니다.</p>
      )}

      <BoardPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default BoardListPage;
