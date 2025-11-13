// src/pages/MyBoards.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBoards } from "../api/boardApi"; // 백엔드에서 /api/boards/my-boards 만들었다고 가정

const MyBoards = ({ user }) => {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
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

  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const handlePrev = () => {
    if (page > 0) loadBoards(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) loadBoards(page + 1);
  };

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="my-boards-page">
      <h2>내 글 모아보기</h2>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <>
          <ul className="my-boards-list">
            {boards.map((board) => (
              <li
                key={board.id}
                className="my-board-item"
                onClick={() => handleBoardClick(board.id)}
              >
                <strong>{board.title}</strong>{" "}
                <span>조회수: {board.viewCount}</span>
                <div>
                  작성일: {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 0}>
              이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button onClick={handleNext} disabled={page >= totalPages - 1}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBoards;
