import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "./axiosConfig";

const SKIP_PATHS = ["/login", "/signup", "/", "/boards"];
const SKIP_PREFIXES = ["/boards"]; // board/** 과 같은 역할

let isAuthChecking = false;

const isPathSkippedSimple = (raw) => {
  const path = raw || window.location.pathname;
  if (SKIP_PATHS.includes(path)) return true;
  if (
    SKIP_PREFIXES.some((pref) => path === pref || path.startsWith(pref + "/"))
  )
    return true;
  return false;
};

const safeRedirectToLogin = (navigate) => {
  if ((window.location.pathname || "") === "/login") return;
  if (typeof navigate === "function") {
    navigate("/login", { replace: true }); // SPA 내비게이션 우선
  } else {
    window.location.href = "/login"; // 폴백
  }
};

const checkAuth = async (pathname, navigate) => {
  const currentPath = pathname || window.location.pathname;

  console.log("핑 체크 시작");

  if (isPathSkippedSimple(currentPath)) return;

  if (isAuthChecking) return; // true -> 요청중, 이미 요청중일때는 리턴
  isAuthChecking = true; // 요청 시작 -> 요청중 상태로 변경

  try {
    const access = localStorage.getItem("accessToken");

    if (!access) {
      console.log("토큰 없음 — ping 호출 없이 로그인으로 이동");
      if (currentPath === "/login") {
        return;
      }
      safeRedirectToLogin(navigate);
      return;
    }
    await api.get("/api/auth/ping"); // 네이게이트로 이동시 jwt토큰 확인 요청
  } catch (err) {
    // 토큰 만료 => 재발급, 토큰 오류 => 로그인창
    // axiosConfig에서 처리됨

    console.error("ping failed: ", err);
  } finally {
    isAuthChecking = false;
  }
};

const usePingOnNavigate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prev = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (prev.current === path) return; // 이전경로와 같으면 패스

    prev.current = path; // 이전 경로 저장

    checkAuth(path, navigate);
  }, [location.pathname, navigate]); // 페이지 이동시 작동
};

export { usePingOnNavigate, checkAuth };
