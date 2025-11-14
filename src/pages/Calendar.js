// CalendarPage.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DiaryDetail from "./DiaryDetail";
import { fetchDiariesByMonth } from "../api/diaryApi"; // api 인스턴스 사용

export default function CalendarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyDiaries, setMonthlyDiaries] = useState([]);
  const [clickResult, setClickResult] = useState({
    date: null,
    exists: null,
    diary: null,
  });

 

  // --------------------------
  // 마운트 시 선택된 날짜 적용
  // --------------------------
  useEffect(() => {
    if (location.state?.selectedDate) {
      const selected = new Date(location.state.selectedDate);
      setCurrentDate(selected);
      setClickResult({
        date: location.state.selectedDate,
        exists: true,
        diary: null,
      });
    }
  }, [location.state]);
// --------------------------
// 월별 일기 로드
// --------------------------
useEffect(() => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const token = localStorage.getItem("accessToken");

  // ⭐ 로그인 안 한 경우: API 호출하지 않음
  if (!token) {
    setMonthlyDiaries([]); // 이모지 없는 빈 달력 유지
    if (!location.state?.selectedDate) {
      setClickResult({ date: null, exists: null, diary: null });
    }
    return;
  }

  // ⭐ 로그인된 경우만 API 호출
  const loadMonthlyDiaries = async () => {
    try {
      const res = await fetchDiariesByMonth(year, month);
      setMonthlyDiaries(res.data);
    } catch (err) {
      console.error("월별 일기 로드 실패:", err);
      if (err.response?.status === 403) {
        alert("로그인이 필요합니다.");
      } else if (err.response?.status === 404) {
        setMonthlyDiaries([]); 
      } else {
        alert("일기 데이터를 불러오는 데 실패했습니다.");
      }
    }
  };

  loadMonthlyDiaries();

  // 선택된 날짜가 없을 때 클릭 결과 초기화
  if (!location.state?.selectedDate) {
    setClickResult({ date: null, exists: null, diary: null });
  }
}, [currentDate, location.state]);
  // --------------------------
  // 날짜 클릭
  // --------------------------
  const handleDateClick = (date) => {
    const dateString = formatDate(date);
    const diary = monthlyDiaries.find((d) => d.date.slice(0, 10) === dateString);

    if (diary) {
      setClickResult({ date: dateString, exists: true, diary });
    } else {
      setClickResult({ date: dateString, exists: false, diary: null });
    }
  };

  // --------------------------
  // 일기 쓰기 버튼
  // --------------------------
  const handleWriteClick = () => {
    if (clickResult.date) {
      navigate("/diary/write", { state: { date: clickResult.date } });
    }
  };

  // --------------------------
  // 달력 각 날짜 칸 표시 (이모지 또는 이미지)
  // --------------------------
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      const diary = monthlyDiaries.find((d) => d.date.slice(0, 10) === dateString);
      if (diary && diary.imageUrl) {
        return (
          <img
            src={diary.imageUrl}
            alt={diary.type}
            width={24}
            height={24}
            style={{ display: "block", margin: "5px auto 0 auto" }}
          />
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-page-wrapper">
      <h2>📅 감정일기 캘린더</h2>
      <Calendar
        onActiveStartDateChange={({ activeStartDate }) =>
          setCurrentDate(activeStartDate)
        }
        value={currentDate}
        onClickDay={handleDateClick}
        tileContent={tileContent}
      />

      {clickResult.exists === true && (
        <div className="diary-result-box">
          <DiaryDetailWrapper
            date={clickResult.date}
            onDelete={(deletedDate) => {
              setMonthlyDiaries((prev) =>
                prev.filter((d) => d.date.slice(0, 10) !== deletedDate)
              );
              setClickResult({ date: deletedDate, exists: false, diary: null });
            }}
          />
        </div>
      )}

      {clickResult.exists === false && (
        <div className="diary-result-box diary-empty">
          <p>{clickResult.date}</p>
          <p>해당 날짜에 작성된 일기가 없습니다.</p>
          <button onClick={handleWriteClick}>일기 쓰기</button>
        </div>
      )}
    </div>
  );
}

// --------------------------
// DiaryDetailWrapper: DiaryDetail 재사용
// --------------------------
function DiaryDetailWrapper({ date, onDelete }) {
  const token = localStorage.getItem("accessToken");
  return <DiaryDetail dateFromCalendar={date} onDelete={onDelete} token={token} />;
}

// --------------------------
// 날짜 객체 → 'YYYY-MM-DD'
// --------------------------
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
