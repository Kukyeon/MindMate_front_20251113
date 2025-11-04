import React, { useState } from "react";

const DiaryEditor = ({ date, diaryDates, setDiaryDates }) => {
  const [content, setContent] = useState("");
  const [aiComment, setAiComment] = useState("");

  const handleSave = () => {
    // 선택 날짜가 아직 diaryDates에 없으면 추가
    const exists = diaryDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );

    if (!exists) {
      setDiaryDates([...diaryDates, date]);
    }

    // TODO: 백엔드 API POST 호출
    // axios.post("/diary", { date, content })

    // 더미 AI 코멘트
    setAiComment("오늘 하루도 수고하셨어요! 💡");
    alert("일기 저장 완료!");
  };

  return (
    <div>
      <h3>{date.toLocaleDateString()} 일기 ✏️</h3>
      <textarea
        rows="8"
        cols="50"
        placeholder="오늘 하루를 기록해보세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleSave}>저장</button>

      {aiComment && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <strong>AI 코멘트:</strong> {aiComment}
        </div>
      )}
    </div>
  );
};

export default DiaryEditor;
