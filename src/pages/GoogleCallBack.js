import { useEffect } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser, saveAuth } from "../api/authApi";
import { handleSocialLoginError } from "../api/socialErrorHandler";
import { useModal } from "../context/ModalContext";

const GoogleCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModal } = useModal();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const stateFromGoogle = query.get("state");
    const stateStored = sessionStorage.getItem("google_oauth_state");

    if (!code) {
      showModal("구글 인가 코드가 없습니다.", "/login");
      return;
    }

    // state 값 체크 (선택이지만, 네이버와 동일 패턴으로 검증)
    if (stateStored && stateFromGoogle && stateStored !== stateFromGoogle) {
      showModal("올바르지 않은 구글 로그인 요청입니다.", "/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/auth/login/google", {
          params: { code },
        });

        const accessToken = res.data.accessToken;
        // const refreshToken = res.data.refreshToken;

        // saveAuth({ accessToken, refreshToken });
        saveAuth({ accessToken });
        console.log("google res:", res.data);
        console.log("after saveAuth:", {
          access: localStorage.getItem("accessToken"),
          // refresh: localStorage.getItem("refreshToken"),
        });

        const user = await getUser();
        if (setUser && user) {
          setUser(user);
        }

        if (!user.nickname) {
          showModal(
            `${user.username}님, 환영합니다! 프로필을 설정해주세요.`,
            "/profile/set/set"
          );
        } else {
          showModal(`${user.nickname}님, 다시 만나서 반가워요!`, "/");
        }
      } catch (err) {
        //showModal("구글 로그인 처리 중 오류가 발생했습니다.", "/login");
        handleSocialLoginError(err, showModal, navigate);
      }
    })();
  }, [location.search, navigate, setUser]);

  return <div>구글 로그인 처리 중...</div>;
};

export default GoogleCallback;
