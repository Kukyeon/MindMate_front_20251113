import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createDiary, fetchDiaryByDate } from "../api/diaryService";

export default function DiaryWritePage() {
  const location = useLocation();
  const presetDate = location.state?.date || "";
  const [date, setDate] = useState(presetDate);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDiary = async () => {
      if (!date) return;
      try {
        const res = await fetchDiaryByDate(date);
        if (res?.data) {
          setTitle(res.data.title);
          setContent(res.data.content);
        }
      } catch (err) {
        // 일기 없는 경우는 그냥 빈 상태 유지
      }
    };
    loadDiary();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return alert("날짜를 선택하세요.");

    const username = localStorage.getItem("username");

    try {
      await createDiary({ title, content, username, date });
      alert("일기가 저장되었습니다.");
     navigate(`/diary/date/${date}`);
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