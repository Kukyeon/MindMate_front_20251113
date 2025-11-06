import { useState } from "react";
import { postComment } from "../../api/commentApi";

const CommentForm = ({ boardId, onCommentAdded, accountId }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await postComment({ boardId, content, accountId });
    setContent("");
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="댓글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">등록</button>
    </form>
  );
};

export default CommentForm;
