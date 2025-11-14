import api from "./axiosConfig";
import { authHeader, authHeader as getAuthHeader } from "./authApi";

//게시글 목록

export const fetchBoards = async (
  page = 0,
  size = 10,
  search = {},
  user = null
) => {
  const headers = user ? await getAuthHeader() : {};
  const params = new URLSearchParams({
    page,
    size,
  });

  if (search.keyword) {
    params.append("field", search.field);
    params.append("keyword", search.keyword);
  }

  const res = await api.get(`/api/boards?${params.toString()}`);
  return res.data;
};

// 게시글 상세
export const fetchBoardDetail = async (id, user = null) => {
  const headers = user ? await getAuthHeader() : {};
  const res = await api.get(`/api/boards/${id}`, { headers });
  return res.data;
};

// 게시글 작성
export const createBoard = async ({ title, content, userId }) => {
  const headers = await getAuthHeader();
  const res = await api.post(
    `/api/boards`,
    {
      title,
      content,
      userId,
    },
    { headers }
  );
  return res.data;
};

// 게시글 수정
export const updateBoard = async (id, { title, content, userId, hashtags }) => {
  const headers = await getAuthHeader();
  const res = await api.put(
    `/api/boards/${id}`,
    {
      title,
      content,
      userId,
      hashtags,
    },
    { headers }
  );
  return res.data;
};

// 게시글 삭제
export const deleteBoard = async (id) => {
  const headers = await getAuthHeader();
  await api.delete(`/api/boards/${id}`, { headers });
};

//내 글 모아보기
export const fetchMyBoards = async (page = 0, size = 10) => {
  const headers = await authHeader();
  const params = new URLSearchParams({ page, size });
  const res = await api.get(`/api/boards/my-boards?${params.toString()}`, {
    headers,
  });
  return res.data;
};

// // 게시글 이모지
// export const toggleBoardEmoji = async (boardId, emojiData) => {
//   const res = await api.post(`/boards/${boardId}/emoji`, emojiData);
//   return res.data;
// };
