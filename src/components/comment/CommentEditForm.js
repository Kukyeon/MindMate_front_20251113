import { useState } from "react";
import { updateComment } from "../../api/commentApi";

const CommentEditForm = ({ comment, onUpdateSuccess }) => {
  const [content, setContent] = useState(comment.content);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateComment(comment.id, content);
    onUpdateSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">수정완료</button>
    </form>
  );
};

export default CommentEditForm;
