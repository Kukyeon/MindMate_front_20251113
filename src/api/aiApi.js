import api from "./axiosConfig";

export const generateHashtags = async (boardId) => {
  try {
    const response = await api.post("/ai/tags", { boardId });
    const text = response.data.aicomment;
    const hashtags = text
      .split(" ")
      .filter((tag) => tag.startsWith("#"))
      .map((tag) => tag.trim());
    return { hashtags };
  } catch (error) {
    console.error("해시태그 생성 실패:", error);
    return { hashtags: [] };
  }
};
