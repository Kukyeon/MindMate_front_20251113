import api from "./axiosConfig";

// 댓글 목록
export const fetchComments = async (boardId) => {
  const res = await api.get(`/comments`, { params: { boardId } });
  return res.data;
};

// 댓글 작성
export const postComment = async (boardId, commentData) => {
  const res = await api.post(`/comments`, { boardId, ...commentData });
  return res.data;
};

// 댓글 수정
export const updateComment = async (id, content) => {
  const res = await api.put(`/comments/${id}`, { content });
  return res.data;
};

//댓글 삭제
export const deleteComment = async (id) => {
  await api.delete(`/comments/${id}`);
};

//댓글 이모지
export const toggleCommentEmoji = async (commentId, emojiData) => {
  const res = await api.post(`/comments/${commentId}/emoji`, emojiData);
  return res.data;
};
