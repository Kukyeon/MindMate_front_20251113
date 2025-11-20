import api from "./axiosConfig";

export const EMAIL_STATUS_INTERVAL_MS = 2000; // 2초
export const MAX_EMAIL_STATUS_ATTEMPTS = 10; // 2초 * 10회 = 20초

// 이메일 중복 체크 + 인증코드 발송 요청
export const requestEmailCode = (email) => {
  return api.get("/api/auth/check_username", {
    params: { username: email },
  });
};

// 이메일 상태 체크폴링
export const startEmailStatusPolling = (
  email,
  { setEmailMessage, setIsEmailChecking, setIsEmailOk }
) => {
  if (!email) return () => {};

  let attempts = 0;

  setIsEmailChecking(true);
  setEmailMessage("이메일 발송 상태를 확인 중입니다...");

  const intervalId = setInterval(async () => {
    attempts += 1;

    try {
      const { data: status } = await api.get("/api/auth/email_status", {
        params: { email },
      });
      // status: "REQUESTED" | "SENT" | "FAILED" | "NONE"

      if (status === "REQUESTED") {
        if (attempts >= MAX_EMAIL_STATUS_ATTEMPTS) {
          setEmailMessage(
            "이메일 전송이 지연되고 있습니다. 메일함을 확인 후, 없다면 다시 시도해주세요."
          );
          setIsEmailChecking(false);
          clearInterval(intervalId);
        } else {
          setEmailMessage("이메일을 보내는 중입니다. 잠시만 기다려주세요.");
        }
        return;
      }

      if (status === "SENT") {
        setEmailMessage(
          "인증코드를 이메일로 보냈습니다. 메일함을 확인해주세요."
        );
        setIsEmailChecking(false);
        setIsEmailOk(true);
        clearInterval(intervalId);
        return;
      }

      if (status === "FAILED") {
        setEmailMessage(
          "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요."
        );
        setIsEmailChecking(false);
        setIsEmailOk(false);
        clearInterval(intervalId);
        return;
      }

      // NONE 또는 알 수 없는 값
      setEmailMessage("이메일 상태를 확인할 수 없습니다. 다시 시도해주세요.");
      setIsEmailChecking(false);
      setIsEmailOk(false);
      clearInterval(intervalId);
    } catch (error) {
      setEmailMessage(
        "이메일 상태 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsEmailChecking(false);
      setIsEmailOk(false);
      clearInterval(intervalId);
    }
  }, EMAIL_STATUS_INTERVAL_MS);

  // 컴포넌트에서 정리할 수 있게 stop 함수 반환
  return () => clearInterval(intervalId);
};
