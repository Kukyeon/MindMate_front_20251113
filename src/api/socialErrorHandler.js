// handleSocialLoginError.js
import axios from "axios";

/**
 * 소셜 로그인 에러 처리 (모듈에서 Hook 직접 사용하지 않고 안전하게 호출)
 *
 * @param {any} error - Axios 에러 객체
 * @param {function} showModal - React Hook에서 가져온 모달 표시 함수
 * @param {function} navigate - react-router navigate 함수
 */
export const handleSocialLoginError = (error, showModal, navigate) => {
  let message =
    "소셜 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const serverMessage = typeof data === "string" ? data : data?.message;

    // 409: 이메일 중복
    if (status === 409) {
      message =
        "이미 이 이메일로 가입된 계정이 있습니다.\n기존 계정으로 로그인하거나 비밀번호 찾기를 이용해주세요.";
    }
    // 400: 이메일 동의 안 함
    else if (
      status === 400 &&
      serverMessage?.startsWith("이메일 정보를 가져올 수 없습니다")
    ) {
      message =
        "소셜 계정에서 이메일 제공에 동의하지 않아 회원가입을 진행할 수 없습니다.\n동의 후 다시 시도해주세요.";
    }
  }

  // showModal 사용 가능 시
  if (showModal) {
    showModal(message, "/login");
  } else {
    // fallback
    alert(message);
    navigate("/login");
  }
};
