import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoards, fetchTags } from "../api/boardApi";
import BoardSearchBar from "../components/board/BoardSearchBar";
import BoardPagination from "../components/board/BoardPagination";
import BoardList from "../components/board/BoardList";
import "./BoardListPage.css";
import HashtagList from "../components/detail/HashtagList";

const BoardListPage = ({ user }) => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState({ field: "title", keyword: "" });
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const userId = user?.userId;

  const loadBoards = useCallback(async () => {
    try {
      const data = await fetchBoards(page, 10, search, userId);
      if (data && data.content) {
        setBoards(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error("게시글 목록 불러오기 실패:", err);
    }
  }, [page, search, userId]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);
  useEffect(() => {
    const getTags = async () => {
      const data = await fetchTags();
      setTags(data);
    };
    getTags();
  }, []);

  //if (!tags.length) return null;
  return (
    <div className="board-page">
      <h2 className="board-page-title">📝 게시판</h2>

      <div className="board-top-bar">
        <BoardSearchBar
          keyword={search.keyword}
          condition={search.field}
          onSearch={setSearch}
        />
        {user && (
          <button
            className="board-write-button"
            onClick={() => navigate("/board/write")}
          >
            글쓰기
          </button>
        )}
      </div>
      <div className="recommended-tags-section">
        {tags.length > 0 && (
          <div className="recommended-tags-header">
            <h4>🔥급상승</h4>
            <HashtagList hashtags={tags} className="inline-hashtags" />
          </div>
        )}
      </div>
      {Array.isArray(boards) && boards.length > 0 ? (
        <BoardList
          className="board-list"
          boards={boards}
          page={page}
          size={10}
          totalElements={totalElements}
        />
      ) : (
        <p className="board-empty">게시글이 없습니다.</p>
      )}

      <div className="board-pagination-wrapper">
        <BoardPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default BoardListPage;
