import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일 (필수)

import DiaryEditor from "./DiaryEditor";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // 일기 작성된 날짜 배열 (나중에 API에서 받아오기)
  const [diaryDates, setDiaryDates] = useState([]);

  // 달력의 날짜 셀 강조
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const found = diaryDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      );
      return found ? "diary-date" : null;
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h2>📅 달력</h2>
        <Calendar
          onClickDay={(value) => setSelectedDate(value)}
          tileClassName={tileClassName}
        />
      </div>

      <div style={{ flex: 1 }}>
        {selectedDate ? (
          <DiaryEditor
            date={selectedDate}
            diaryDates={diaryDates}
            setDiaryDates={setDiaryDates}
          />
        ) : (
          <p>날짜를 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
