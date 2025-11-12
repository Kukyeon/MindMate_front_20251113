import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDiariesByMonth } from '../api/diaryApi'; // 월별 조회 API
import DiaryDetail from './DiaryDetail';

export default function CalendarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 캘린더 월
  const [monthlyDiaries, setMonthlyDiaries] = useState([]); // 월별 일기
  const [clickResult, setClickResult] = useState({ date: null, exists: null, diary: null });

    // 마운트 시 한 번만 실행: 뒤로가기 시 선택된 날짜 적용
  useEffect(() => {
      if (location.state?.selectedDate) {
    const selected = new Date(location.state.selectedDate);
    setCurrentDate(selected);
    setClickResult({ date: location.state.selectedDate, exists: true, diary: null }); 
    // diary는 필요 시 fetch 후 채우기
  }
}, []); // 빈 배열: 마운트 1회만

  // 월 변경 시 월별 일기 불러오기
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const loadMonthlyDiaries = async () => {
      try {
        const res = await fetchDiariesByMonth(year, month);
        setMonthlyDiaries(res.data);
      } catch (err) {
        console.error("월별 일기 로드 실패:", err);
        alert("일기 데이터를 불러오는 데 실패했습니다.");
      }
    };
    loadMonthlyDiaries();

    // 월이 바뀌면 클릭 결과 초기화
    setClickResult({ date: null, exists: null, diary: null });
  }, [currentDate]);

  // 날짜 클릭
  const handleDateClick = (date) => {
    const dateString = formatDate(date);
    const diary = monthlyDiaries.find(d => d.date === dateString);

    if (diary) {
      setClickResult({ date: dateString, exists: true, diary });
    } else {
      setClickResult({ date: dateString, exists: false, diary: null });
    }
  };

  // 일기 쓰기 버튼
  const handleWriteClick = () => {
    if (clickResult.date) {
      navigate('/diary/write', { state: { date: clickResult.date } });
    }
  };

  // 달력 각 날짜 칸 이모지 표시
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDate(date);
      const diary = monthlyDiaries.find(d => d.date === dateString);
      if (diary && diary.imageUrl) {
        return (
          <img
            src={diary.imageUrl}
            alt={diary.type}
            width={20}
            height={20}
            style={{ display: 'block', margin: 'auto', marginTop: '5px' }}
          />
        );
      }
    }
    return null;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📅 감정일기 캘린더</h2>
      <Calendar
        onActiveStartDateChange={({ activeStartDate }) => setCurrentDate(activeStartDate)}
        value={currentDate}
        onClickDay={handleDateClick}
        tileContent={tileContent}
      />

      {/* 클릭한 날짜에 따라 DiaryDetail 또는 메시지 표시 */}
     {clickResult.exists === true && (
    <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
    <DiaryDetailWrapper 
      date={clickResult.date} 
      onDelete={(deletedDate) => {
        // 1️⃣ 삭제된 날짜 월별 일기에서 제거
        setMonthlyDiaries(prev => prev.filter(d => d.date !== deletedDate));
        // 2️⃣ clickResult 업데이트 → "일기 없음" 메시지 표시
        setClickResult({ date: deletedDate, exists: false, diary: null });
      }} 
    />
        </div>
      )}

      {clickResult.exists === false && (
        <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <p style={{ fontWeight: 'bold' }}>{clickResult.date}</p>
          <p>해당 날짜에 작성된 일기가 없습니다.</p>
          <button onClick={handleWriteClick} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            일기 쓰기
          </button>
        </div>
      )}
    </div>
  );
}

// DiaryDetailWrapper: DiaryDetail 재사용
function DiaryDetailWrapper({ date, onDelete }) {
  return <DiaryDetail dateFromCalendar={date} onDelete={onDelete} />;
}

// 날짜 객체 → 'YYYY-MM-DD'
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
