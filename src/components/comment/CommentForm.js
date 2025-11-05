import { useState } from "react";
import { postComment } from "../../api/commentApi";

const CommentForm = ({ boardId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await postComment({ boardId, content, writer });
    setContent("");
    setWriter("");
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="작성자"
        value={writer}
        onChange={(e) => setWriter(e.target.value)}
      />
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
