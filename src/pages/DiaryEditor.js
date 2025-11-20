import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import { fetchDiaryByDate, updateDiaryByDate } from "../api/diaryApi";
import { useModal } from "../context/ModalContext";

export default function DiaryEditor() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [emoji, setEmoji] = useState(null);
  const [diary, setDiary] = useState({ title: "", content: "", username: "" });
  const [errors, setErrors] = useState({ title: "", content: "", emoji: "" });

  // ==========================
  // 기존 일기 불러오기
  // ==========================
  useEffect(() => {
    if (!date) return;

    const fetchDiary = async () => {
      try {
        const res = await fetchDiaryByDate(date);
        setDiary(res.data);
        setEmoji(res.data.emoji);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
        const status = error.response?.status;
        if (status === 404) showModal("해당 날짜에 작성된 일기가 없습니다.");
        else if (status === 403) showModal("로그인이 필요합니다.");
        else showModal("일기 조회 실패");

        navigate("/diary/calendar");
      }
    };

    fetchDiary();
  }, [date, navigate]);

  // ==========================
  // 입력값 변경
  // ==========================
  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ==========================
  // 저장
  // ==========================
  const handleSave = async (e) => {
    e.preventDefault();

    let newErrors = { title: "", content: "", emoji: "" };

    if (!diary.title.trim()) newErrors.title = "제목을 입력해 주세요";
    else if (diary.title.trim().length < 5)
      newErrors.title = "글 제목은 최소 5글자 이상이어야 합니다.";

    if (!diary.content.trim()) newErrors.content = "내용을 입력해 주세요";
    else if (diary.content.trim().length < 5)
      newErrors.content = "글 내용은 최소 5글자 이상이어야 합니다.";

    if (!emoji) newErrors.emoji = "감정을 선택해 주세요";

    setErrors(newErrors);

    // 에러 있으면 중단
    if (newErrors.title || newErrors.content || newErrors.emoji) return;

    const { id, type, imageUrl } = emoji;
    const dataToSend = {
      title: diary.title,
      content: diary.content,
      emoji: { id, type, imageUrl },
    };

    try {
      await updateDiaryByDate(date, dataToSend);
      showModal("수정되었습니다.", () => {
        navigate("/diary/calendar", { state: { selectedDate: date } });
      });
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      const status = error.response?.status;

      if (status === 400) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          return;
        }
        showModal("입력값이 올바르지 않습니다.");
      } else if (status === 403) {
        showModal("권한이 없습니다. 다시 로그인 해주세요!", "/login");
      } else {
        showModal("수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="diary-editor-card">
      <h2>✏️ {date} 일기 수정</h2>

      <form onSubmit={handleSave}>
        {/* 제목 */}
        <div className="editor-field">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={diary.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p className="diary-error">{errors.title}</p>}
        </div>

        {/* 내용 */}
        <div className="editor-field">
          <label>내용</label>
          <textarea
            name="content"
            value={diary.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
          />
          {errors.content && <p className="diary-error">{errors.content}</p>}
        </div>

        {/* 감정 이모지 */}
        <div className="emoji-picker-wrapper">
          <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />
          {errors.emoji && <p className="diary-error">{errors.emoji}</p>}
        </div>

        <div className="diary-editor-buttons">
          <button type="submit">저장</button>
          <button
            type="button"
            onClick={() =>
              navigate("/diary/calendar", { state: { selectedDate: date } })
            }
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
