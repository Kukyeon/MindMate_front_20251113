import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import api from "../api/axiosConfig";
import { fetchDiaryByDate, updateDiaryByDate } from "../api/diaryApi";

export default function DiaryEditor() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [emoji, setEmoji] = useState(null);
  const [diary, setDiary] = useState({ title: "", content: "", username: "" });
  const [errors, setErrors] = useState({ title: "", content: "", emoji: "" });
  const token = localStorage.getItem("accessToken");

  // 기존 일기 불러오기
  useEffect(() => {
    if (!date) return;

    const fetchDiary = async () => {
      try {
         const res = await fetchDiaryByDate(date); // API 함수 사용
        setDiary(res.data);
        setEmoji(res.data.emoji);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
        const status = error.response?.status;
        if (status === 404) alert("해당 날짜에 작성된 일기가 없습니다.");
        else if (status === 403) alert("로그인이 필요합니다.");
        else alert("일기 조회 실패");
        navigate("/diary/calendar");
      }
    };

    fetchDiary();
  }, [date, navigate]);

  // 입력값 변경 처리
  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // 변경 시 에러 초기화
  };

  // 수정 저장 처리
  const handleSave = async (e) => {
    e.preventDefault();

    // ---------------------------
    // 프론트 Validation
    // ---------------------------
    let newErrors = { title: "", content: "", emoji: "" };
    if (!diary.title.trim()) newErrors.title = "제목을 입력해 주세요";
    else if (diary.title.trim().length < 5) newErrors.title = "글 제목은 최소 5글자 이상이어야 합니다.";

    if (!diary.content.trim()) newErrors.content = "내용을 입력해 주세요";
    else if (diary.content.trim().length < 5) newErrors.content = "글 내용은 최소 5글자 이상이어야 합니다.";

    if (!emoji) newErrors.emoji = "감정을 선택해 주세요";

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    if (newErrors.title || newErrors.content || newErrors.emoji) return;

    const { id, type, imageUrl } = emoji;
    const dataToSend = { title: diary.title, content: diary.content, emoji: { id, type, imageUrl } };

    try {
      await updateDiaryByDate(date, dataToSend); // API 함수로 수정 요청
      alert("수정되었습니다.");
      navigate("/diary/calendar", { state: { selectedDate: date } });
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      const status = error.response?.status;
      if (status === 400) {
        // 서버에서 Validation 메시지 내려오면
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          return;
        } else {
          alert("입력값이 올바르지 않습니다.");
        }
      } else if (status === 403) {
        alert("로그인 정보가 없거나 권한이 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="diary-editor-card">
      <h2>{date} 일기 수정</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={diary.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        </div>

        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={diary.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
          />
          {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}
        </div>

        <div>
          <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />
          {errors.emoji && <p style={{ color: "red" }}>{errors.emoji}</p>}
        </div>

        <div className="diary-editor-buttons">
          <button type="submit">저장</button>
          <button
            type="button"
            onClick={() => navigate("/diary/calendar", { state: { selectedDate: date } })}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}