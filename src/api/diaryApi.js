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
export const createDiary = (data) =>
  api.post(`/api/diary`, data, { headers: getAuthHeader() });

// 월별 일기 조회 (캘린더용)
export const fetchDiariesByMonth = (year, month) =>
  api.get(`/api/diary/month`, {
    params: { year, month },
    headers: getAuthHeader(),
  });

//일기 수정
export const updateDiaryByDate = (date, data) =>
  api.put(`/api/diary/date?date=${date}`, data, { headers: getAuthHeader() });

//일기 삭제
export const deleteDiaryByDate = (date) =>
  api.delete(`/api/diary/date/${date}`, { headers: getAuthHeader() });