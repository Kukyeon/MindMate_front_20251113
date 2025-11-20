import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { fetchComments } from "../../api/commentApi";
import CommentItem from "./CommentItem";

const CommentList = forwardRef(({ boardId, userId }, ref) => {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(boardId);
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    loadComments,
  }));

  useEffect(() => {
    loadComments();
  }, [boardId]);

  return (
    <div className="comment-list-container">
      <h3 className="comment-list-title">💬 댓글</h3>
      {comments.length === 0 ? (
        <p className="comment-empty">아직 댓글이 없습니다.</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdated={loadComments}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default CommentList;
