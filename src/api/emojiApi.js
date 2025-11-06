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
  return await api.post(`/emoji/toggle`, {
    boardId,
    accountId: data.accountId, // 필요 시 전달
    type: data.type,
    imageUrl: data.imageUrl,
  });
};

//  댓글 이모지 토글
export const toggleCommentEmoji = async (commentId, data) => {
  return await api.post(`/emoji/toggle`, {
    commentId,
    accountId: data.accountId,
    type: data.type,
    imageUrl: data.imageUrl,
  });
};

//  게시글/댓글 이모지 카운트 조회
export const getEmojiCounts = async (id, targetType = "board") => {
  const endpoint =
    targetType === "board" ? `/emoji/board/${id}` : `/emoji/comment/${id}`;
  const res = await api.get(endpoint);

  // 백엔드 리스트 형태를 { type: count } 구조로 변환
  const counts = {};
  res.data.forEach((emoji) => {
    counts[emoji.type] = emoji.count;
  });

  return counts;
};
