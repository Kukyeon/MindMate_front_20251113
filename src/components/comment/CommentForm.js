import { useState } from "react";
import { postComment } from "../../api/commentApi";
import { authHeader } from "../../api/authApi";
import { useModal } from "../../context/ModalContext";

const CommentForm = ({ boardId, onCommentAdded, userId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("댓글을 입력하세요.");
    setLoading(true);

    try {
      const headers = await authHeader();
      await postComment({ boardId, content, userId }, { headers });
      setContent("");
      if (onCommentAdded) {
        await onCommentAdded();
      }
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      showModal("댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-input"
        value={content}
        placeholder="댓글을 입력하세요..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="comment-btn" type="submit" disabled={loading}>
        {loading ? "등록 중..." : "등록"}
      </button>
    </form>
  );
};

export default CommentForm;
