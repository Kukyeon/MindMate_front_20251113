import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일
import { useNavigate } from 'react-router-dom';
import { fetchDiariesByMonth } from '../api/diaryService'; // 월별 조회 API 함수

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 캘린더가 보여주는 월의 날짜
  const [monthlyDiaries, setMonthlyDiaries] = useState([]); // 해당 월의 일기 데이터
  
  // 1. [추가] 날짜 클릭 결과를 저장할 state (일기 없음 메시지 표시용)
  const [clickResult, setClickResult] = useState({ date: null, exists: null });

  // 월(Month)이 변경될 때마다 월별 일기 데이터를 불러옴
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JS의 월은 0부터 시작하므로 +1

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

    // 2. [추가] 월이 바뀌면 클릭 결과 메시지 숨기기
    setClickResult({ date: null, exists: null }); 

  }, [currentDate]); // currentDate가 변경될 때 (월 이동 시) 이펙트 재실행

  // 3. [수정] 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    const dateString = formatDate(date); // 'YYYY-MM-DD' 형식 변환
    
    // 이 날짜에 일기가 있는지 월별 데이터에서 확인
    const diary = monthlyDiaries.find(d => d.date === dateString);
    
    if (diary) {
      // 4. 일기가 있으면: 상세 페이지로 즉시 이동
      navigate(`/diary/date/${dateString}`); 
    } else {
      // 5. 일기가 없으면: 상태를 설정하여 메시지 표시 (페이지 이동 X)
      setClickResult({ date: dateString, exists: false });
    }
  };

  // '일기 쓰기' 버튼 클릭 핸들러 (메시지 영역에서)
  const handleWriteClick = () => {
    if (clickResult.date) {
      // '일기 쓰기' 페이지로 날짜 정보를 state에 담아 이동
      navigate('/diary/write', { state: { date: clickResult.date } });
    }
  };

  // 캘린더의 각 날짜 칸(tile)에 이모지를 렌더링하는 함수
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
        // 6. '월' 이동 시 currentDate state를 업데이트 (useEffect 트리거)
        onActiveStartDateChange={({ activeStartDate }) => setCurrentDate(activeStartDate)}
        value={currentDate}
        onClickDay={handleDateClick} // 날짜 칸 클릭 이벤트
        tileContent={tileContent} // 각 날짜 칸에 이모지 렌더링
      />
      
      {/* 7. [추가] 날짜 클릭 결과에 따라 메시지 및 버튼 표시 */}
      {clickResult.exists === false && (
        <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <p style={{ fontWeight: 'bold' }}>{clickResult.date}</p>
          <p>해당 날짜에 작성된 일기가 없습니다.</p>
          <button onClick={handleWriteClick} style={{ padding: '8px 12px', cursor: 'pointer' }}>
            일기 쓰기
          </button>
        </div>
      )}

      {/* 통계 페이지 이동 버튼 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/diary/stats')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          통계 페이지로 이동
        </button>
      </div>
    </div>
  );
}

// 날짜 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}