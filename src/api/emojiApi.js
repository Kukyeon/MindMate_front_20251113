import api from "./axiosConfig";
import { authHeader as getAuthHeader } from "./authApi";

export const emojiList = [
  { id: 1, type: "heart", image: "/emojis/heart.png" },
  { id: 2, type: "love", image: "/emojis/love.png" },
  { id: 3, type: "happy", image: "/emojis/happy.png" },
  { id: 4, type: "calm", image: "/emojis/calm.png" },
  { id: 5, type: "laugh", image: "/emojis/laugh.png" },
  { id: 6, type: "surprised", image: "/emojis/surprised.png" },
  { id: 7, type: "joy", image: "/emojis/joy.png" },
  { id: 8, type: "down", image: "/emojis/down.png" },
  { id: 9, type: "confused", image: "/emojis/confused.png" },
  { id: 10, type: "sad", image: "/emojis/sad.png" },
  { id: 11, type: "dizzy", image: "/emojis/dizzy.png" },
  { id: 12, type: "cry", image: "/emojis/cry.png" },
  { id: 13, type: "gasp", image: "/emojis/gasp.png" },
  { id: 14, type: "sick", image: "/emojis/sick.png" },
  { id: 15, type: "anger", image: "/emojis/anger.png" },
];

//  게시글 이모지 토글
export const toggleBoardEmoji = async (boardId, data) => {
  const headers = await getAuthHeader();
  return await api.post(
    `/api/emoji/toggle`,
    {
      boardId,
      type: data.type,
      imageUrl: data.imageUrl,
    },
    { headers }
  );
};

//  댓글 이모지 토글
export const toggleCommentEmoji = async (commentId, data) => {
  const headers = await getAuthHeader();
  return await api.post(
    `/api/emoji/toggle`,
    {
      commentId,
      type: data.type,
      imageUrl: data.imageUrl,
    },
    { headers }
  );
};

//  게시글/댓글 이모지 카운트 조회 (+ 내 선택 포함)
export const getEmojiCounts = async (id, targetType = "board") => {
  const headers = await getAuthHeader();
  const endpoint =
    targetType === "board"
      ? `/api/emoji/board/${id}`
      : `/api/emoji/comment/${id}`;

  const res = await api.get(endpoint, { headers });

  // 백엔드에서 반환된 리스트 구조를 가공
  const counts = {};
  res.data.forEach((emoji) => {
    counts[emoji.type] = {
      count: emoji.count,
      selected: emoji.selected, //  내가 누른 이모지 표시 가능
      imageUrl: emoji.imageUrl,
    };
  });

  return counts;
};
