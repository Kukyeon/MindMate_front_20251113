import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";

const BoardEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const accountId = (() => {
    const stored = localStorage.getItem("accountId");
    return stored ? parseInt(stored, 10) : 1;
  })();

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const board = await fetchBoardDetail(id);
        if (board) {
          setTitle(board.title);
          setContent(board.content);
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };
    loadBoard();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBoard(id, { title, content, accountId });
      await generateHashtags(id);
      alert("게시글이 수정되었습니다!");
      navigate(`/board/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/board/${id}`);
  };

  return (
    <div className="board-edit-page">
      <div className="board-header-card">
        <h2 className="board-title">✏️ 게시글 수정</h2>
      </div>

      <div className="board-content-card">
        <form className="board-edit-form" onSubmit={handleSubmit}>
          <input
            className="board-edit-input"
            type="text"
            placeholder="제목을 수정하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="board-edit-textarea"
            placeholder="내용을 수정하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="board-edit-buttons">
            <button className="board-btn submit" type="submit">
              수정 완료
            </button>
            <button
              className="board-btn cancel"
              type="button"
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardEditPage;
