import api from "./axiosConfig";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 토큰 키 이름 확인
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 전체 목록 조회
// export const fetchDiaries = (page = 0, size = 10) =>
//   api.get(`/api/diary?page=${page}&size=${size}`, { headers: getAuthHeader() });

// 단일 조회 (id 기준)
export const fetchDiaryDetail = (id) =>
  api.get(`/api/diary/${id}`, { headers: getAuthHeader() });

// 날짜별 조회 (YYYY-MM-DD)
export const fetchDiaryByDate = (date) =>
  api.get(`/api/diary/date`, { params: { date }, headers: getAuthHeader() });

// 일기 작성
export const createDiaryWithImage = (data, imageFile) => {
  const formData = new FormData();

  // JSON 데이터를 문자열로 변환
  formData.append("data", JSON.stringify(data));

  // 이미지 파일 추가
  if (imageFile) formData.append("image", imageFile);

  return api.post("/api/diary/with-image", formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });
};

// 월별 일기 조회 (캘린더용)
export const fetchDiariesByMonth = (year, month) =>
  api.get(`/api/diary/month`, {
    params: { year, month },
    headers: getAuthHeader(),
  });

// 일기 수정 (이미지 포함)
export const updateDiaryWithImage = (date, data, imageFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (imageFile) formData.append("image", imageFile);

  return api.put("/api/diary/with-image?date=" + date, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

//일기 삭제
export const deleteDiaryByDate = (date) =>
  api.delete(`/api/diary/date/${date}`, { headers: getAuthHeader() });

export const recommendEmoji = (content) => {
  return api.post(
    "/api/diary/emoji",
    { content },
    { headers: getAuthHeader() }
  );
};
