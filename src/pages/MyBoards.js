// src/pages/MyBoards.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBoards } from "../api/boardApi";

const MyBoards = ({ user }) => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadBoards = async (pageNum = 0) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchMyBoards(pageNum, size);
      setBoards(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (err) {
      console.error("내 글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [user]);

  if (!user) {
    return <div className="my-boards-login">로그인이 필요합니다.</div>;
  }

  return (
    <div className="my-boards-page">
      <h2 className="my-boards-title">내 글 모아보기</h2>

      {loading ? (
        <div className="my-boards-loading">로딩 중...</div>
      ) : (
        <>
          <ul className="my-boards-list">
            {boards.map((board) => (
              <li
                key={board.id}
                className="my-board-card"
                onClick={() => navigate(`/board/${board.id}`)}
              >
                <div className="my-board-header">
                  <strong className="my-board-title" title={board.title}>
                    {board.title}
                  </strong>
                  <span className="my-board-views">
                    조회수: {board.viewCount}
                  </span>
                </div>
                <div className="my-board-date">
                  작성일: {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>

          <div className="my-boards-pagination">
            <button onClick={() => loadBoards(page - 1)} disabled={page === 0}>
              이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => loadBoards(page + 1)}
              disabled={page >= totalPages - 1}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBoards;
