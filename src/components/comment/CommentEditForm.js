import { useState } from "react";
import { updateComment } from "../../api/commentApi";

const CommentEditForm = ({ comment, onUpdateSuccess }) => {
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  // ⚡ 임시 로그인
  const userId = parseInt(localStorage.getItem("userId") || 1, 10);

  // ⚡ 실제 로그인 적용 시 (주석 해제 후 사용)
  // const userId = comment.userId || 현재 로그인 유저 ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      await updateComment(comment.id, { content, userId });
      onUpdateSuccess();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-edit-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-edit-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="comment-edit-actions">
        <button className="comment-edit-btn" type="submit">
          {loading ? "수정 중..." : "수정완료"}
        </button>
      </div>
    </form>
  );
};

export default CommentEditForm;
