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

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;
  try {
    const res = await api.post("/api/auth/refresh", { refreshToken });
    const newAccessToken = res.data?.accessToken;
    if (!newAccessToken) return null;
    localStorage.setItem(ACCESS_KEY, newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("refresh 실패:", err);
    return null;
  }
};

export const getUser = async () => {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken) {
    try {
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data;
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error("me 실패 (401 아님):", err);
        clearAuth();
        return null;
      }
    }
  }
  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    clearAuth();
    return null;
  }

  try {
    const res = await api.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    return res.data;
  } catch {
    clearAuth();
    return null;
  }
};
