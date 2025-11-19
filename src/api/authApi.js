import api from "./axiosConfig";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const saveAuth = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
// 요청 헤더용 accessToken 가져오기 (자동 갱신 포함)
export const authHeader = async () => {
  let accessToken = localStorage.getItem(ACCESS_KEY);
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};
// 요청 헤더용 accessToken 가져오기 (자동 갱신 포함)

export const getUser = async () => {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);

  if (!accessToken || !refreshToken) return null;

  try {
    const res = await api.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (err) {
    return null;
  }
};
