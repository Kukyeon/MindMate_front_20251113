import { useState } from "react";
import { deleteComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";
import CommentEditForm from "./CommentEditForm";

const CommentItem = ({ comment, onUpdated, userId }) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      await deleteComment(comment.id, userId);
      onUpdated();
    }
  };

  return (
    <div className="comment-item-card">
      <div className="comment-header">
        <span className="comment-writer">{comment.writer}</span>
        <span className="comment-date">
          {new Date(comment.createdate).toLocaleDateString()}
        </span>
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
          <button
            className="comment-btn edit"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "취소" : "수정"}
          </button>
          <button className="comment-btn delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
