import { useEffect, useState } from "react";
import { fetchComments } from "../../api/commentApi";
import CommentItem from "./CommentItem";

const CommentList = ({ boardId }) => {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    const data = await fetchComments(boardId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [boardId]);

  return (
    <div>
      <h3>댓글</h3>
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onUpdated={loadComments} />
      ))}
    </div>
  );
};
export default CommentList;
