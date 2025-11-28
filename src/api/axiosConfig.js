import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
// const REFRESH_TOKEN_KEY = "refreshToken";
const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
// const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setAccessToken = (token) =>
  token && localStorage.setItem(ACCESS_TOKEN_KEY, token);

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8888";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {},
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** ======= */

const isTokenRefreshRequire = (error) => {
  // 응답X === 재시도X
  if (!error?.response) return false;

  const originalRequest = error.config || {}; // 실패한 요청
  const statusCode = error.response.status; // 상태코드
  const url = originalRequest?.url || "";

  // 리프레시 요청에서 401 오류 발생시, 리프레시 시도 X
  const isFromRefresh = url.includes("/api/auth/refresh");
  const firstTime = !originalRequest?._retry; // 리프레시 무한루프 방지

  // Authorization 헤더가 붙은 요청만 리프레시 대상
  const headers = originalRequest.headers || {};
  const authHeader = headers.Authorization || headers.authorization;
  const hasAuthHeader = typeof authHeader === "string";

  // 에러 발생시, message 체크;
  const message = error.response.data?.message;
  // 메세지 "Access token expired" => 토큰 관련 이슈
  const isAccessTokenExpired = message === "Access token expired";

  // 모든 조건 충족시 true 리턴
  return (
    statusCode === 401 &&
    firstTime &&
    !isFromRefresh &&
    hasAuthHeader &&
    isAccessTokenExpired
  );
};

// 리프레시 상태 (true => accessToken 재발급중)
let isRefreshing = false;
// 리프레시 진행중 요청 대기열 (리프레시 상태 false => 재발급토큰으로 다시 시도)
let refreshWaitQueue = [];

/**리프레시 진행중 요청 대기열에 등록 (완료시 새 토큰으로 다시 시도) */
const waitForRefreshCompletion = () =>
  new Promise((resolve, reject) => refreshWaitQueue.push({ resolve, reject }));

/** 리프레시 종료 시, 대기열 요청 처리 */
const notifyRefreshWaiters = (error) => {
  refreshWaitQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  refreshWaitQueue = [];
};
/** ======= */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!isTokenRefreshRequire(error)) return Promise.reject(error);

    const originalRequest = error.config;
    originalRequest._retry = true;

    if (isRefreshing) {
      await waitForRefreshCompletion();
      const token = getAccessToken();
      if (!token) return Promise.reject(error);

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${token}`,
      };
      return api(originalRequest);
    }

    /** ======= */
    isRefreshing = true;
    try {
      const accessToken = getAccessToken();
      // const refreshToken = getRefreshToken();
      // if (!accessToken || !refreshToken) {
      //   return Promise.reject(error);
      // }

      if (!accessToken) {
        return Promise.reject(error);
      }

      const { data } = await refreshClient.post("/api/auth/refresh", {
        accessToken,
        // refreshToken,
      });

      const newAccessToken = data?.accessToken;
      if (!newAccessToken) throw new Error("No access token in response");

      setAccessToken(newAccessToken);
      notifyRefreshWaiters(null);

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };
      return api(originalRequest);
    } catch (e) {
      clearTokens();
      notifyRefreshWaiters(e);

      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      window.location.replace("/");

      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
