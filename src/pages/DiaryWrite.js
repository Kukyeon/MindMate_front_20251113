import { useState } from "react";
import { createDiary, fetchDiaryByDate } from "../api/diaryService";
import { useLocation, useNavigate } from "react-router-dom";

export default function DiaryWritePage() {
  const location = useLocation();
  const presetDate = location.state?.date || "";
  const [date, setDate] = useState(presetDate);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return alert("날짜를 선택하세요.");

    const username = localStorage.getItem("username");

    try {
      // 날짜 중복 체크
      const existing = await fetchDiaryByDate(date);
      if (existing.data) {
        alert("이미 이 날짜에 작성된 일기가 있습니다.");
        return;
      }
    } catch (_) {
      // 없는 경우엔 그대로 진행
    }

    try {
      await createDiary({ title, content, username, createdate: date });
      alert("일기가 저장되었습니다.");
      navigate("/diary/calendar");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  return (
    <div>
      <h2>일기 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">저장</button>
      </form>
    </div>
  );
}
