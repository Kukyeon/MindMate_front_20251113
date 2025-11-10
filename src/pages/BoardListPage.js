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
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const loadBoards = useCallback(async () => {
    try {
      const data = await fetchBoards(page, 10, keyword);
      if (data && data.content) {
        setBoards(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("게시글 목록 불러오기 실패:", err);
    }
  }, [page, keyword]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return (
    <div>
      <h2>📝 게시판</h2>
      <BoardSearchBar keyword={keyword} onSearch={setKeyword} />
      <button onClick={() => navigate("/board/write")}>글쓰기</button>

      {/* ✅ 게시글이 존재하지 않아도 에러 없이 렌더링 */}
      {Array.isArray(boards) && boards.length > 0 ? (
        <BoardList boards={boards} />
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
