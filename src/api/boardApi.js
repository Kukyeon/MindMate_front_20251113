import api from "./axiosConfig";

//게시글 목록
export const fetchBoards = async (page = 0, size = 10, keyword = "") => {
  const res = await api.get(`/boards`, { params: { page, size, keyword } });
  return res.data;
};

//게시글 상세
export const fetchBoardDetail = async (id) => {
  const res = await api.get(`/boards/${id}`);
  return res.data;
};

//게시글 작성
export const createBoard = async (data) => {
  const res = await api.post(`/boards`, data);
  return res.data;
};

//게시글 수정
export const updateBoard = async (id, data) => {
  const res = await api.put(`/boards/${id}`, data);
  return res.data;
};

//게시글 삭제
export const deleteBoard = async (id) => {
  await api.delete(`/boards/${id}`);
};

//게시글 이모지
export const toggleBoardEmoji = async (boardId, emojiData) => {
  const res = await api.post(`/boards/${boardId}/emoji`, emojiData);
  return res.data;
};
