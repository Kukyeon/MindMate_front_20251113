import { useState } from "react";
import { deleteComment, updateComment } from "../../api/commentApi";
import EmojiSelector from "../detail/EmojiSelector";

const CommentItem = ({ comment, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleUpdate = async () => {
    await updateComment(comment.id, content);
    setEditing(false);
    onUpdated();
  };

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
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleUpdate}>저장</button>
        </>
      ) : (
        <p>{comment.content}</p>
      )}

      <EmojiSelector commentId={comment.id} />
      <button onClick={() => setEditing(!editing)}>수정</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};
export default CommentItem;
