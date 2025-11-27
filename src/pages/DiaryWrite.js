import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authHeader, getUser } from "../api/authApi";
import api from "../api/axiosConfig";
import { createDiaryWithImage, fetchDiaryByDate } from "../api/diaryApi";
import { useModal } from "../context/ModalContext";
import LoadingBar from "../components/LoadingBar";

export default function DiaryWritePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModal, showConfirm } = useModal();

  const date = location.state?.date;

  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({ title: "", content: "", emoji: "" });
  const [isSaving, setIsSaving] = useState(false);

  // 🌟 이미지 삭제 버튼
  const handleDeleteImage = () => {
    setImage(null);
    setPreviewUrl("");
    document.getElementById("customFileInput").value = "";
  };

  // 사용자 정보 가져오기
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

  // 기존 일기 불러오기
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
        if (errors.response?.status === 404) {
          console.log("해당 날짜에 일기가 없음");
          return;
        }
        console.error("일기 조회 오류:", errors);
      }
    };
    loadDiary();
  }, [date, user?.accessToken]);

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { title: "", content: "", emoji: "" };

    if (!title.trim()) newErrors.title = "제목을 입력해 주세요";
    if (!content.trim()) newErrors.content = "내용을 입력해 주세요";

    setErrors(newErrors);

    if (newErrors.title || newErrors.content) return;
    if (!user?.userId) return showModal("로그인이 필요합니다.");

    if (isSaving) return;
    setIsSaving(true);

    try {
      const diaryData = {
        title,
        content,
        userId: user.userId,
        nickname: user.nickname,
        date,
        emoji,
      };

      await createDiaryWithImage(diaryData, image);

      const headers = await authHeader();
      let charResData = null;

      try {
        const charRes = await api.get(`/ai/me`, { headers });
        charResData = charRes.data;
      } catch (err) {
        if (err.response?.status !== 404) throw err;
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
          "일기가 저장되었습니다!\n캐릭터가 없어요.\n캐릭터를 생성할까요?",
          () => navigate("/profile", { state: { tab: "Character" } })
        );
      }
    } catch (errors) {
      console.error("일기 저장 실패:", errors);
      showModal(errors.response?.data?.message || "일기 저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingUser) return <div>사용자 정보 로딩 중...</div>;
  if (!user) return <p>로그인이 필요합니다.</p>;
  if (!date) return <div>날짜 정보 확인 중...</div>;

  return (
    <div className="diary-write-card" style={{ position: "relative" }}>
      {isSaving && (
        <div className="graph-loading-overlay">
          <LoadingBar loading={true} message="AI가 답변 중..." />
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

        {/* 이미지 첨부 & 미리보기 */}
        <div className="editor-field">
          <input
            type="file"
            id="customFileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <label htmlFor="customFileInput" className="custom-file-button">
            이미지 첨부
          </label>

          {previewUrl ? (
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="미리보기" className="image-preview" />
              <button
                type="button"
                className="delete-image-button"
                onClick={handleDeleteImage}
              >
                x
              </button>
            </div>
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
