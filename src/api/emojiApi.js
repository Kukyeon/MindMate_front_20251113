import api from "./axiosConfig";

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
  return await api.post(`/emoji/toggle`, {
    boardId,

    type: data.type,
    imageUrl: data.imageUrl,
  });
};

//  댓글 이모지 토글
export const toggleCommentEmoji = async (commentId, data) => {
  return await api.post(`/emoji/toggle`, {
    commentId,

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
