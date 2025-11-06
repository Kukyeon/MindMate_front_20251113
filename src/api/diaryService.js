import api from "./axiosConfig";

// 전체 목록 조회
// export const fetchDiaries = (page = 0, size = 10) =>
//   api.get(`/api/diary?page=${page}&size=${size}`);

// 단일 조회 (id 기준)
export const fetchDiaryDetail = (id) => api.get(`/api/diary/${id}`);

// 날짜별 조회 (YYYY-MM-DD)
export const fetchDiaryByDate = (date) =>
  api.get(`/api/diary/date`, { params: { date } });

// 일기 작성
export const createDiary = (data) => api.post(`/api/diary`, data);
