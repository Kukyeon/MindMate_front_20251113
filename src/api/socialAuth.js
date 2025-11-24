const KAKAO_REST_API_KEY = "d032aea47f7cde0d9d176389f15a4053";
const KAKAO_REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";
const KAKAO_DELETE_REDIRECT_URI =
  "http://localhost:3000/auth/kakao/delete-callback";

const NAVER_CLIENT_ID = "ca5VSclizDaIGPg981EJ";
const NAVER_REDIRECT_URI = "http://localhost:3000/auth/naver/callback";
const NAVER_DELETE_REDIRECT_URI =
  "http://localhost:3000/auth/naver/delete-callback";

const GOOGLE_CLIENT_ID =
  "866215417194-hsrr4k4h24rku7ng7le4rvnq8s9dqviv.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const GOOGLE_DELETE_REDIRECT_URI =
  "http://localhost:3000/auth/google/delete-callback";
const GOOGLE_SCOPE = "openid email profile";

// 공통 state 생성 함수
const createRandomState = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 14);
};

export const buildKakaoAuthUrl = () => {
  return (
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(KAKAO_REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`
  );
};

export const buildNaverAuthUrl = () => {
  const state = createRandomState();
  return (
    "https://nid.naver.com/oauth2.0/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(NAVER_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}`
  );
};

export const buildGoogleAuthUrl = () => {
  const state = createRandomState();
  sessionStorage.setItem("google_oauth_state", state);

  return (
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(GOOGLE_SCOPE)}` +
    `&state=${encodeURIComponent(state)}`
  );
};

export const buildKakaoDeleteAuthUrl = () => {
  const state = createRandomState();
  return (
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(KAKAO_REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(KAKAO_DELETE_REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}`
  );
};

export const buildNaverDeleteAuthUrl = () => {
  const state = createRandomState();
  return (
    "https://nid.naver.com/oauth2.0/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(NAVER_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(NAVER_DELETE_REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}`
  );
};

export const buildGoogleDeleteAuthUrl = () => {
  const state = createRandomState();
  sessionStorage.setItem("google_delete_state", state);

  return (
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_DELETE_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(GOOGLE_SCOPE)}` +
    `&state=${encodeURIComponent(state)}`
  );
};
