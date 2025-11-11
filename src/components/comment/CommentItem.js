import { useState } from "react";
import { deleteComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";
import CommentEditForm from "./CommentEditForm";

const CommentItem = ({ comment, onUpdated }) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      await deleteComment(comment.id);
      onUpdated();
    }
  };

  return (
    <div className="comment-item-card">
      <div className="comment-header">
        <span className="comment-writer">{comment.account.id}</span>
        <span className="comment-date">
          {new Date(comment.createdate).toLocaleDateString()}
        </span>
      </div>

      <div className="comment-body">
        {editing ? (
          <CommentEditForm
            comment={comment}
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
        <EmojiSelector commentId={comment.id} />
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
