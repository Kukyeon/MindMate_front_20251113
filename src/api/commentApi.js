import api from "./axiosConfig";

// 댓글 목록
export const fetchComments = async (boardId) => {
  const res = await api.get(`/comments/boards/${boardId}`);
  return res.data;
};

// 댓글 작성
export const postComment = async (commentData) => {
  const res = await api.post(`/comments`, commentData);
  return res.data;
};

// 댓글 수정
export const updateComment = async (id, data) => {
  const res = await api.put(`/comments/${id}`, data);
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  await api.delete(`/comments/${commentId}`);
};

// 댓글 이모지
// export const toggleCommentEmoji = async (commentId, emojiType, accountId) => {
//   const res = await api.post(`/comments/${commentId}/emoji`, {
//     accountId,
//     emojiType,
//   });
//   return res.data;
// };
