import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import api from "../api/axiosConfig";

export default function DiaryEditor() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [emoji, setEmoji] = useState(null);
  const [diary, setDiary] = useState({ title: "", content: "", username: "" });

  // 기존 일기 불러오기
  useEffect(() => {
    if (!date) return;

    const fetchDiary = async () => {
      try {
        const res = await api.get("/api/diary/date", { params: { date } });
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

  // 수정 저장 처리
  const handleSave = async (e) => {
    e.preventDefault();
    if (!emoji) return alert("감정을 선택해 주세요");

    const { id, type, imageUrl } = emoji;
    const dataToSend = { title: diary.title, content: diary.content, emoji: { id, type, imageUrl } };

    try {
      await api.put(`/api/diary/date?date=${date}`, dataToSend);
      alert("수정되었습니다.");
      navigate("/diary/calendar", { state: { selectedDate: date } });
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      const status = error.response?.status;
      if (status === 403) {
        alert("로그인 정보가 없거나 권한이 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("수정 중 오류가 발생했습니다.");
      }
    }
  };

  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
  };

  return (
    <div className="diary-editor-card">
      <h2>{date} 일기 수정</h2>
      <form onSubmit={handleSave}>
        <label>제목</label>
        <input type="text" name="title" value={diary.title} onChange={handleChange} required />
        <label>내용</label>
        <textarea name="content" value={diary.content} onChange={handleChange} required />
        <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />
        <div className="diary-editor-buttons">
          <button type="submit">저장</button>
          <button type="button" onClick={() => navigate("/diary/calendar", { state: { selectedDate: date } })}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
