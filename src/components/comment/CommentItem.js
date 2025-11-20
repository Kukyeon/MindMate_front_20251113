import { useState } from "react";
import { deleteComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";
import CommentEditForm from "./CommentEditForm";

const CommentItem = ({ comment, onUpdated, userId, user }) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      await deleteComment(comment.id, userId);
      onUpdated();
    }
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
