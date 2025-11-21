import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import { useModal } from "../context/ModalContext";

const BoardEditPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = user.userId;

  useEffect(() => {
    const loadBoard = async () => {
      if (!userId) return;
      try {
        const board = await fetchBoardDetail(id, user);
        if (board) {
          setTitle(board.title);
          setContent(board.content);
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, user, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return showModal("로그인이 필요합니다.", "/login");
    try {
      await updateBoard(id, { title, content, userId });
      // await generateHashtags(id);
      showModal("게시글이 수정되었습니다!", `/board/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      showModal("수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/board/${id}`);
  };

  if (!userId) return <p>로그인이 필요합니다.</p>;
  if (loading) return <p>불러오는 중...</p>;

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
