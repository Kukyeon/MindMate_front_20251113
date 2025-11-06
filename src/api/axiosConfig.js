import axios from "axios";

const BASE_URL = "http://localhost:8888";
const LOGIN_PATH = "/login";

const api = axios.create({
  // access token용
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const authApi = axios.create({
  // refresh token용 (토큰 재생성 요청 분리 목적)
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false; // 엑세스토큰 재발급 진행 표시
let failedQueue = []; // jwt 토큰 발급중 요청들 저장 (발급후 한번에 처리)

const processQueue = (error, token = null) => {
  // 토큰 생성시 쌓인 요청 처리
  failedQueue.forEach(({ resolve, reject }) => {
    // resolve: 비동기 작업 성공, // reject: 비동기 작업 실패
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = []; // 모든 요청을 처리하면 초기화
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    //토큰이 있으면 모든 api 요청시 Authorization에 토큰 정보를 넣어서 보냄
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // 토큰이 없을시 Authorization 제거
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // access token 만료시 401 발생 해당 로직 실행
    const originalRequest = error.config; // 요청사항
    // 서버 인증 실패 (accessToken 만료) / 한번 시도한 요청 -> 재시도 X (무한루프 방지)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // alert("만료");
      if (isRefreshing) {
        // 현재 토큰 발급중이면, 실행
        return new Promise((resolve, reject) => {
          // 큐에 요청 등록후 대기 (토큰 발급 완료)
          failedQueue.push({ resolve, reject }); // 발급 성공 실패에 따른 처리를 위한 로직
        }).then((token) => {
          // 성공 -> 헤더에 엑세스 토큰 넣기
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest); //엑세스 토큰 발급후 이전 요청 재시도
        });
      }

      // 토큰 재발급을 처음 시도
      originalRequest._retry = true; // 토큰 발급 이후 재시도 방지용
      isRefreshing = true; // 현재 작업중임을 알림
      try {
        const resp = await authApi.post("/api/auth/refresh", {
          // 서버에 엑세스 토큰 재발급 요청
          accessToken: localStorage.getItem("accessToken"), // 만료된 토큰으로 redis에 저장된 refreshToken 검색,
          refreshToken: localStorage.getItem("refreshToken"), // redis에 있는 token과 비교
        });
        const newAccess = resp.data.accessToken; // 새로운 엑세스 토큰
        localStorage.setItem("accessToken", newAccess); //
        processQueue(null, newAccess); // 지금껏 쌓인 대기 요청 활성화
        originalRequest.headers.Authorization = `Bearer ${newAccess}`; // 헤더 Authorizatuon에 새로운 토큰을 넣기
        return api(originalRequest); // 대기 요청을 처리 시작
      } catch (err) {
        processQueue(err, null); // 재발급 실패 로그아웃으로 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = LOGIN_PATH; // 로그인 페이지로 이동
        return Promise.reject(err);
      } finally {
        isRefreshing = false; // 토큰 재발급 및 이후 프로세스가 끝남을 말함
      }
    }
    return Promise.reject(error);
  }
);

export default api;
