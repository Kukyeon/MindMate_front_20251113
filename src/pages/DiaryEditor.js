import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";

export default function DiaryEditor() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [emoji, setEmoji] = useState(null);
  const [diary, setDiary] = useState({
    title: "",
    content: "",
    username: "",
  });

  // 기존 일기 불러오기
  useEffect(() => {
    if (!date) return;

    const fetchDiary = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/diary/date?date=${date}`
        );
        if (!response.ok) throw new Error("일기 조회 실패");
        const data = await response.json();

        setDiary(data);
        setEmoji(data.emoji);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
        alert("일기 조회 실패");
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
    const dataToSend = {
      title: diary.title,
      content: diary.content,
      emoji: { id, type, imageUrl },
    };
    console.log("PUT URL:", `http://localhost:8888/api/diary/date/${date}`);
    console.log("Request Body:", JSON.stringify(dataToSend));
    try {
      const response = await fetch(
        `http://localhost:8888/api/diary/date?date=${date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) throw new Error("수정 실패");

      alert("수정되었습니다.");
      // 수정 후 해당 날짜 DiaryDetail 페이지로 이동
      navigate("/diary/calendar", { state: { selectedDate: date } });
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 제목/내용 변경
  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
  };

  return (
    <div className="diary-editor-card">
      <h2>{date} 일기 수정</h2>
      <form onSubmit={handleSave}>
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={diary.title}
          onChange={handleChange}
          required
        />

        <label>내용</label>
        <textarea
          name="content"
          value={diary.content}
          onChange={handleChange}
          required
        />

        <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />

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
