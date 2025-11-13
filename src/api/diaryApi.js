import api from "./axiosConfig";

// 전체 목록 조회
// export const fetchDiaries = (page = 0, size = 10) =>
//   api.get(`/api/diary?page=${page}&size=${size}`);

// 단일 조회 (id 기준)
export const fetchDiaryDetail = (id) => api.get(`/api/diary/${id}`);

// 날짜별 조회 (YYYY-MM-DD)
export const fetchDiaryByDate = (date) =>
  api.get(`/api/diary`, { params: { date } });

// 일기 작성
export const createDiary = (data) => api.post(`/api/diary`, data);

// ⬇️ 월별 일기 조회 (캘린더용)
export const fetchDiariesByMonth = (year, month) => {
  return api.get("/api/diary/month", {
    params: { year, month },
  });
};

// // ⬇️ [추가] 통계 조회 (통계 페이지용)
// export const fetchEmotionStats = (startDate, endDate) => {
//   return api.get(`/api/diary/stats`, {
//     params: { startDate, endDate } // 쿼리 파라미터로 시작일과 종료일 전달
//   });
// };
