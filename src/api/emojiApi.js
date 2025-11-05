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

export const toggleBoardEmoji = (boardId, data) =>
  api.post(`/boards/${boardId}/emoji`, data);

export const toggleCommentEmoji = (commentId, data) =>
  api.post(`/comment/${commentId}/emoji`, data);

export const getEmojiCounts = (id, type) =>
  api.get(`/emoji/${type}/${id}/count`);
