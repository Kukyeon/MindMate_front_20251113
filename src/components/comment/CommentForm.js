import { useState } from "react";
import { postComment } from "../../api/commentApi";
import { authHeader } from "../../api/authApi";

const CommentForm = ({ boardId, onCommentAdded, userId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  // ⚡ 임시 로그인
  //const userId = parseInt(localStorage.getItem("userId") || 1, 10);

  // ⚡ 실제 로그인 적용 시 (주석 해제 후 사용)
  // const userId = comment.userId ||현재 로그인 유저 ID;

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
      alert("댓글 등록 중 오류가 발생했습니다.");
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
