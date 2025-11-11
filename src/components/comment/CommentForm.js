import { useState } from "react";
import { postComment } from "../../api/commentApi";

const CommentForm = ({ boardId, onCommentAdded, accountId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      await postComment({ boardId, content, accountId });
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
