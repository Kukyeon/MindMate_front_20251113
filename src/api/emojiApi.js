import api from "./axiosConfig";

export const emojiList = [
  { id: 1, name: "heart", image: "/emojis/heart.png" },
  { id: 2, name: "love", image: "/emojis/love.png" },
  { id: 3, name: "happy", image: "/emojis/happy.png" },
  { id: 4, name: "calm", image: "/emojis/calm.png" },
  { id: 5, name: "laugh", image: "/emojis/laugh.png" },
  { id: 6, name: "surprised", image: "/emojis/surprised.png" },
  { id: 7, name: "joy", image: "/emojis/joy.png" },
  { id: 8, name: "down", image: "/emojis/down.png" },
  { id: 9, name: "confused", image: "/emojis/confused.png" },
  { id: 10, name: "sad", image: "/emojis/sad.png" },
  { id: 11, name: "dizzy", image: "/emojis/dizzy.png" },
  { id: 12, name: "cry", image: "/emojis/cry.png" },
  { id: 13, name: "gasp", image: "/emojis/gasp.png" },
  { id: 14, name: "sick", image: "/emojis/sick.png" },
  { id: 15, name: "anger", image: "/emojis/anger.png" },
];

//  게시글 이모지 토글
export const toggleBoardEmoji = async (boardId, data) => {
  const res = await api.post(`/boards/${boardId}/emoji`, data);
  return res.data;
};

//  댓글 이모지 토글
export const toggleCommentEmoji = async (commentId, data) => {
  const res = await api.post(`/comments/${commentId}/emoji`, data);
  return res.data;
};

//  게시글/댓글 이모지 카운트 조회
export const getEmojiCounts = async (id, type) => {
  const res = await api.get(`/emoji/${type}/${id}/count`);
  return res.data;
};
