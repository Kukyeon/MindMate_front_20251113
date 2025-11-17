import axios from "axios";

export const handleSocialLoginError = (error, navigate) => {
  if (!axios.isAxiosError(error) || !error.response) {
    alert("소셜 로그인 중 알 수 없는 오류가 발생했습니다.");
    navigate("/login");
    return;
  }

  const { status, data } = error.response;
  const message = typeof data === "string" ? data : data?.message;

  // 409: 이메일 중복
  if (status === 409) {
    alert(
      "이미 이 이메일로 가입된 계정이 있습니다.\n기존 계정으로 로그인하거나 비밀번호 찾기를 이용해주세요."
    );
    navigate("/login");
    return;
  }

  // 400: 이메일 동의 안 함 (백엔드 메시지 기반)
  if (
    status === 400 &&
    message?.startsWith("이메일 정보를 가져올 수 없습니다")
  ) {
    alert(
      "소셜 계정에서 이메일 제공에 동의하지 않아 회원가입을 진행할 수 없습니다.\n동의 후 다시 시도해주세요."
    );
    navigate("/login");
    return;
  }

  // 그 외
  alert("소셜 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  navigate("/login");
};
