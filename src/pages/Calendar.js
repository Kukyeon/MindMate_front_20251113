import { useState } from "react";
import { fetchDiaryByDate } from "../api/diaryService";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState("");
  const [diary, setDiary] = useState(null);
  const navigate = useNavigate();

  // 날짜를 클릭했을 때 호출
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!date) return;

    try {
      // 백엔드에서 해당 날짜의 일기 조회
      const res = await fetchDiaryByDate(date);

      if (res && res.data) {
        // 일기가 있으면 바로 상세 페이지로 이동
        navigate(`/diary/${res.data.id}`);
      } else {
        // 일기가 없으면 작성 페이지로 이동
        navigate("/diary/write", { state: { date } });
      }
    } catch (err) {
      console.error("❌ 일기 조회 오류:", err);
      // 일기가 없을 경우 (404 등)
      navigate("/diary/write", { state: { date } });
    }
  };

  return (
    <div>
      <h2>📅 날짜별 감정일기</h2>

      <input type="date" value={selectedDate} onChange={handleDateChange} />
    </div>
  );
}

export default Calendar;
