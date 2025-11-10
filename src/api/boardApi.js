import api from "./axiosConfig";

//게시글 목록

export const fetchBoards = async (page = 0, size = 10, search = {}) => {
  const params = new URLSearchParams({
    page,
    size,
  });

  if (search.keyword) {
    params.append("field", search.field);
    params.append("keyword", search.keyword);
  }

  const res = await api.get(`/boards?${params.toString()}`);
  return res.data;
};

// 게시글 상세
export const fetchBoardDetail = async (id) => {
  const res = await api.get(`/boards/${id}`);
  return res.data;
};

// 게시글 작성
export const createBoard = async ({ title, content, accountId }) => {
  const res = await api.post(`/boards?accountId=${accountId}`, {
    title,
    content,
    accountId,
  });
  return res.data;
};

// 게시글 수정
export const updateBoard = async (id, { title, content, accountId }) => {
  const res = await api.put(`/boards/${id}`, {
    title,
    content,
    accountId,
  });
  return res.data;
};

// 게시글 삭제
export const deleteBoard = async (id) => {
  await api.delete(`/boards/${id}`);
};

// // 게시글 이모지
// export const toggleBoardEmoji = async (boardId, emojiData) => {
//   const res = await api.post(`/boards/${boardId}/emoji`, emojiData);
//   return res.data;
// };
