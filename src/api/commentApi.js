import api from "./axiosConfig";

// 댓글 목록
export const fetchComments = async (boardId) => {
  const res = await api.get(`/api/comments/boards/${boardId}`);
  console.log(res.data);
  return Array.isArray(res.data) ? res.data : [];
};

// 댓글 작성
export const postComment = async ({ boardId, content, userId }) => {
  const res = await api.post(`/api/comments`, { boardId, content, userId });
  return res.data;
};

// 댓글 수정
export const updateComment = async (id, { content, userId }) => {
  const res = await api.put(`/api/comments/${id}`, {
    content,
    userId,
  });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  await api.delete(`/api/comments/${commentId}`);
};

// 댓글 이모지
// export const toggleCommentEmoji = async (commentId, emojiType, accountId) => {
//   const res = await api.post(`/comments/${commentId}/emoji`, {
//     accountId,
//     emojiType,
//   });
//   return res.data;
// };
