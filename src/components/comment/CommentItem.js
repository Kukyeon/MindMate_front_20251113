import { useState } from "react";
import { deleteComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";
import CommentEditForm from "./CommentEditForm";
import { useModal } from "../../context/ModalContext";

const CommentItem = ({ comment, onUpdated, userId, user }) => {
  const [editing, setEditing] = useState(false);
  const { showModal, showConfirm } = useModal();
  const handleDelete = async () => {
    if (!userId) return showModal("로그인이 필요합니다.", "/login");
    showConfirm("댓글을 삭제하시겠습니까?", async () => {
      try {
        await deleteComment(comment.id, userId);
        onUpdated();
        showModal("댓글이 삭제되었습니다.");
      } catch (err) {
        console.error("댓글 삭제 실패:", err);
        showModal("댓글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  const canModify =
    userId && (comment.writerId === userId || user.role === "ADMIN");
  return (
    <div className="comment-item-card">
      <div className="comment-header">
        <span className="comment-writer">
          {comment.writer}
          {comment.writerRole === "ADMIN" && " (관리자)"}
        </span>
        <span className="comment-date">{comment.createdate}</span>
      </div>

      <div className="comment-body">
        {editing ? (
          <CommentEditForm
            comment={comment}
            userId={userId}
            onUpdateSuccess={() => {
              setEditing(false);
              onUpdated();
            }}
          />
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}
      </div>

      <div className="comment-footer">
        <EmojiSelector commentId={comment.id} userId={userId} />
        <div className="comment-actions">
          {canModify && (
            <>
              <button
                className="comment-btn edit"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "취소" : "수정"}
              </button>
              <button className="comment-btn delete" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
