import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { useNavigate, useLocation } from "react-router-dom";
import DiaryDetail from "./DiaryDetail";
import { fetchDiariesByMonth } from "../api/diaryApi";
import { useModal } from "../context/ModalContext";

export default function CalendarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

    if (!token) {
      setMonthlyDiaries([]);
      if (!location.state?.selectedDate) {
        setClickResult({ date: null, exists: null, diary: null });
      }
      return;
    }

    const loadMonthlyDiaries = async () => {
      try {
        const res = await fetchDiariesByMonth(year, month);
        setMonthlyDiaries(res.data);
      } catch (err) {
        console.error("월별 일기 로드 실패:", err);
        if (err.response?.status === 403) {
          showModal("로그인이 필요합니다.");
        } else if (err.response?.status === 404) {
          setMonthlyDiaries([]);
        } else {
          showModal("일기 데이터를 불러오는 데 실패했습니다.");
        }
      }
    };

    loadMonthlyDiaries();

    if (!location.state?.selectedDate) {
      setClickResult({ date: null, exists: null, diary: null });
    }
  }, [currentDate, location.state]);

  // --------------------------
  // 날짜 클릭
  // --------------------------
  const handleDateClick = (date) => {
    const dateString = formatDate(date);
    const todayString = formatDate(new Date());
    const diary = monthlyDiaries.find(
      (d) => d.date.slice(0, 10) === dateString
    );

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
    const today = formatDate(new Date());

    // ❗ 미래 날짜 클릭 방지
    if (clickResult.date > today) {
      showModal("미래 날짜에는 일기를 작성할 수 없습니다.");
      return;
    }

    if (clickResult.date) {
      navigate("/diary/write", { state: { date: clickResult.date } });
    }
  };

  // --------------------------
  // 달력 각 날짜 칸 표시
  // --------------------------
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      const diary = monthlyDiaries.find(
        (d) => d.date.slice(0, 10) === dateString
      );

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
        onActiveStartDateChange={({ activeStartDate }) => {
          setCurrentMonth(activeStartDate); // 달 변경 시 달력 기준만 변경
        }}
        activeStartDate={currentMonth} // 화면에 표시되는 달
        value={currentDate} // 실제 선택된 날짜
        onClickDay={handleDateClick} // 클릭 시 선택 날짜 변경
        tileContent={tileContent}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            if (date.getMonth() !== currentMonth.getMonth()) {
              return "not-current-month";
            }
          }
          return null;
        }}
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
// DiaryDetailWrapper
// --------------------------
function DiaryDetailWrapper({ date, onDelete }) {
  const token = localStorage.getItem("accessToken");
  return (
    <DiaryDetail dateFromCalendar={date} onDelete={onDelete} token={token} />
  );
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
