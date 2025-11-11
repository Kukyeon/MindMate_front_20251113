import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { fetchComments } from "../../api/commentApi";
import CommentItem from "./CommentItem";

const CommentList = forwardRef(({ boardId }, ref) => {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(boardId);
      setComments(data);
      console.log(data.data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    loadComments, // 부모가 호출 가능하게 등록
  }));

  useEffect(() => {
    loadComments();
  }, [boardId]);

  return (
    <div>
      <h3>댓글</h3>
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdated={loadComments}
          />
        ))
      )}
    </div>
  );
});
export default CommentList;
