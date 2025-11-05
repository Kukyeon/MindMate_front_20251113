import { useState } from "react";
import { deleteComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";
import CommentEditForm from "./CommentEditForm";

const CommentItem = ({ comment, onUpdated }) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      await deleteComment(comment.id);
      onUpdated();
    }
  };

  return (
    <div>
      <p>
        <strong>{comment.writer}</strong>
      </p>

      {editing ? (
        <CommentEditForm
          comment={comment}
          onUpdateSuccess={() => {
            setEditing(false);
            onUpdated();
          }}
        />
      ) : (
        <p>{comment.content}</p>
      )}

      <EmojiSelector commentId={comment.id} />
      <button onClick={() => setEditing(!editing)}>
        {editing ? "취소" : "수정"}
      </button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};
export default CommentItem;
