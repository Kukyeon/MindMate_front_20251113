import api from "./axiosConfig";
import { authHeader as getAuthHeader } from "./authApi";

// 댓글 목록
export const fetchComments = async (boardId, user = null) => {
  const headers = user ? await getAuthHeader() : {};
  const res = await api.get(`/api/comments/boards/${boardId}`, {
    headers,
  });
  return Array.isArray(res.data) ? res.data : [];
};

// 댓글 작성
export const postComment = async ({ boardId, content, userId }) => {
  const headers = await getAuthHeader();
  const res = await api.post(
    `/api/comments`,
    { boardId, content, userId },
    { headers }
  );
  return res.data;
};

// 댓글 수정
export const updateComment = async (id, { content, userId }) => {
  const headers = await getAuthHeader();
  const res = await api.put(
    `/api/comments/${id}`,
    {
      content,
      userId,
    },
    { headers }
  );
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const headers = await getAuthHeader();
  await api.delete(`/api/comments/${commentId}`, { headers });
};
