import { useState } from "react";
import { fetchDiaryByDate } from "../api/diaryService";
import { useNavigate } from "react-router-dom";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState("");
  // 'not_found' 상태를 관리할 새로운 state
  const [diaryCheckResult, setDiaryCheckResult] = useState(null);
  const navigate = useNavigate();

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setDiaryCheckResult(null); // 날짜가 바뀌면 메시지 초기화

    if (!date) return;

    try {
      const res = await fetchDiaryByDate(date);

      if (res?.data) {
        // ⬇️⬇️⬇️ [수정된 부분] ⬇️⬇️⬇️
        // URL 파라미터를 사용하는 올바른 경로로 이동합니다.
        navigate(`/diary/date/${date}`);
      } else {
        // ❔ 200 OK이지만 데이터가 없는 경우 (API 설계에 따라)
        setDiaryCheckResult("not_found");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // ❌ 404 에러 (일기 없음): 'not_found' 상태 설정
        setDiaryCheckResult("not_found");
      } else {
        // 기타 에러
        console.error("일기 확인 중 오류 발생:", err);
        alert("오류가 발생했습니다.");
      }
    }
  };

  // '일기 쓰기' 버튼 클릭 시
  const handleWriteClick = () => {
    navigate("/diary/write", { state: { date: selectedDate } });
  };

  return (
    <div>
      <h2>📅 날짜별 감정일기</h2>
      <input type="date" value={selectedDate} onChange={handleDateChange} />

      {/* ⬇️ 일기 없을 때 메시지 표시 ⬇️ */}
      {diaryCheckResult === "not_found" && (
        <div>
          <p>해당 날짜에 작성된 일기가 없습니다.</p>
          <button onClick={handleWriteClick}>일기 쓰기</button>
        </div>
      )}
    </div>
  );
}