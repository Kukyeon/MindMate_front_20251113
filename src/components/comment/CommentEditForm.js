import { useState } from "react";
import { updateComment } from "../../api/commentApi";
import { useModal } from "../../context/ModalContext";

const CommentEditForm = ({ comment, onUpdateSuccess, userId }) => {
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading || !userId) return;

    try {
      setLoading(true);
      await updateComment(comment.id, { content, userId });
      onUpdateSuccess();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      showModal("댓글 수정 중 오류가 발생했습니다.");
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
        <button
          className="comment-edit-btn"
          type="submit"
          disabled={loading || !userId}
        >
          {loading ? "수정 중..." : "수정완료"}
        </button>
      </div>
    </form>
  );
};

export default CommentEditForm;
