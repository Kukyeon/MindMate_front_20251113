import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8888",
  //withCredentials: true,
});

//가짜 로그인
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
