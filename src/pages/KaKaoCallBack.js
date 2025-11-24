import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { getUser, saveAuth } from "../api/authApi";
import { handleSocialLoginError } from "../api/socialErrorHandler";
import { useModal } from "../context/ModalContext";

const KakaoCallback = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModal } = useModal();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (!code) {
      showModal("카카오 인가 코드가 없습니다.", "/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/auth/login/kakao", {
          params: { code },
        });

        const accessToken = res.data.accessToken;
        // const refreshToken = res.data.refreshToken;

        // saveAuth({ accessToken, refreshToken });
        saveAuth({ accessToken });

        const user = await getUser();
        if (setUser && user) {
          setUser(user);
        }

        if (!user.nickname) {
          showModal(
            `${user.username}님, 환영합니다! 프로필을 설정해주세요.`,
            "/profile/set"
          );
        } else {
          showModal(`${user.nickname}님, 다시 만나서 반가워요!`, "/");
        }
      } catch (err) {
        //showModal("카카오 로그인 처리 중 오류가 발생했습니다.", "/login");
        handleSocialLoginError(err, showModal, navigate);
      }
    })();
  }, [location.search, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
