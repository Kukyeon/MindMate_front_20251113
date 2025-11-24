import api from "./axiosConfig";

export const requestEmailCode = (email) => {
  return api.get("/api/auth/check_username", {
    params: { username: email },
  });
};
