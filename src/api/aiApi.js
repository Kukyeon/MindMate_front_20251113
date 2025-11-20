import api from "./axiosConfig";

export const generateHashtags = async (boardId) => {
  try {
    const res = await api.post(`/ai/tags`, { boardId });
    const aiText = res.data.aicomment || res.data.text || "";
    const hashtags = aiText
      .split(/[\s,]+/) // 공백/콤마 등 전부 처리
      .filter((word) => word.startsWith("#"))
      .map((tag) => tag.trim());
    console.log("✅ AI 해시태그 결과:", hashtags);
    return { hashtags };
  } catch (err) {
    console.error("AI 해시태그 생성 실패:", err);
    return { hashtags: [] };
  }
};
