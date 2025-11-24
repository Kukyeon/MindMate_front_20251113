import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { createDiary, fetchDiaryByDate } from "../api/diaryApi";
import { authHeader, getUser } from "../api/authApi";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import api from "../api/axiosConfig";
import { createDiaryWithImage, recommendEmoji } from "../api/diaryApi";
import { fetchDiaryByDate } from "../api/diaryApi";
import { useModal } from "../context/ModalContext";
import LoadingBar from "../components/LoadingBar";
export default function DiaryWritePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { showConfirm } = useModal();
  const date = location.state?.date;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState(null); // 반드시 선택하도록 null 초기값
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [image, setImage] = useState(null);
  // 에러 상태
  const [errors, setErrors] = useState({ title: "", content: "", emoji: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const currentUser = await getUser();
      if (!currentUser) {
        showModal("로그인이 필요합니다.", "/login");
        return;
      }
      setUser(currentUser);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (!date) {
      showModal("날짜가 선택되지 않았습니다.", "/diary");
      return;
    }

    const loadDiary = async () => {
      try {
        const res = await fetchDiaryByDate(date, user?.accessToken);
        if (res?.data) {
          setTitle(res.data.title || "");
          setContent(res.data.content || "");
          setEmoji(res.data.emoji || null);
        }
      } catch (errors) {
        if (errors.response && errors.response.status === 404) {
          console.log("해당 날짜에 일기가 없음. 새로 작성");
          return null;
        } else {
          console.error("일기 조회 중 오류:", errors);
        }
      }
    };
    loadDiary();
  }, [date, user?.accessToken]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------
    // 프론트 유효성 검사
    // ---------------------
    const newErrors = { title: "", content: "", emoji: "" };
    if (!title.trim()) newErrors.title = "제목을 입력해 주세요";
    else if (title.trim().length < 5)
      newErrors.title = "글 제목은 최소 5글자 이상이어야 합니다.";

    if (!content.trim()) newErrors.content = "내용을 입력해 주세요";
    else if (content.trim().length < 5)
      newErrors.content = "글 내용은 최소 5글자 이상이어야 합니다.";

    //if (!emoji) newErrors.emoji = "감정을 선택해 주세요";

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    if (newErrors.title || newErrors.content || newErrors.emoji) return;

    if (!user?.userId) return showModal("로그인이 필요합니다.");
    if (isSaving) return;

    setIsSaving(true);

    try {
      setIsSaving(true);

      const diaryData = {
        title,
        content,
        userId: user.userId,
        nickname: user.nickname,
        date,
        emoji,
      };

      // JSON + 이미지 함께 서버로 전송
      await createDiaryWithImage(diaryData, image);

      // 캐릭터 처리
      const headers = await authHeader();
      let charResData = null;

      try {
        const charRes = await api.get(`/ai/me`, { headers });
        charResData = charRes.data;
      } catch (errors) {
        if (errors.response?.status === 404) charResData = null;
        else throw errors;
      }

      if (charResData) {
        await api.put("/ai/update", null, {
          params: { addPoints: 10, moodChange: 5 },
          headers,
        });
        showModal("일기가 저장되었습니다! 캐릭터가 성장했어요!", () => {
          navigate("/diary/calendar", { state: { selectedDate: date } });
        });
      } else {
        showConfirm(
          "일기가 저장되었습니다!\n캐릭터가 없어서 성장하지 못했어요.\n캐릭터를 생성할까요?",
          () => {
            navigate("/profile", { state: { tab: "Character" } });
          },
          () => {
            // ❌ 취소 눌렀을 때 처리 (선택사항)
            console.log("캐릭터 생성 취소");
          }
        );
      }
    } catch (errors) {
      console.error("일기 저장 실패:", errors);
      showModal(errors.response?.data?.message || "일기 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingUser) return <div>사용자 정보 로딩 중...</div>;
  if (!user?.userId) return <p>로그인이 필요합니다.</p>;
  if (!date) return <div>날짜 정보 확인 중...</div>;

  return (
    <div className="diary-write-card" style={{ position: "relative" }}>
      {isSaving && (
        <div className="graph-loading-overlay">
          <LoadingBar loading={true} message="🤖 AI가 답변 중..." />
        </div>
      )}

      <h2>📝 {date} 일기 작성</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="diary-error">{errors.title}</p>}
        </div>

        <div>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content && <p className="diary-error">{errors.content}</p>}
        </div>

        <div className="editor-field">
          {/* 숨긴 input */}
          <input
            type="file"
            id="customFileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* 커스텀 버튼 */}
          <label htmlFor="customFileInput" className="custom-file-button">
            이미지 첨부
          </label>

          {/* 미리보기 */}
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="미리보기"
              className="image-preview"
            />
          ) : (
            <p className="no-image-text">첨부파일 없음</p>
          )}
        </div>
        <div className="diary-write-buttons">
          <button type="submit">저장</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
