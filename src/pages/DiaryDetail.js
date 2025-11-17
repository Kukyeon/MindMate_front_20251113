// DiaryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDiaryByDate } from "../api/diaryApi";
import { deleteDiaryByDate } from "../api/diaryApi";

export default function DiaryDetail({ dateFromCalendar, onDelete }) {
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("accessToken");
  // 캘린더에서 전달된 날짜 우선, URL 파라미터는 fallback
  const date = dateFromCalendar || params.date;

  useEffect(() => {
    if (!date) {
      navigate("/diary/calendar");
      return;
    }

    const loadDiary = async () => {
      try {
        setLoading(true);
        const res = await fetchDiaryByDate(date); // ✅ API 함수 사용
        setDiary(res.data);
      } catch (err) {
        console.error("❌ fetchDiary 오류:", err);
        const status = err.response?.status;
        if (status === 404) {
          alert("해당 날짜에 작성된 일기가 없습니다.");
          navigate("/diary/write", { state: { date } });
        } else if (status === 403) {
          alert("로그인이 필요합니다.");
          navigate("/login");
        } else {
          alert("일기를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDiary();
  }, [date, navigate]);

   // 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm(`${date} 날짜의 일기를 정말로 삭제하시겠습니까?`)) return;

    try {
      await deleteDiaryByDate(date); // ✅ API 함수 사용
      alert("일기가 삭제되었습니다.");
      setDiary(null);
      if (onDelete) onDelete(date); // 캘린더 상태 갱신
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!diary) return <div>일기 데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="diary-detail-wrapper">
      <h2>{diary.title}</h2>
      <p>
        <strong>작성자:</strong> {diary.nickname}
      </p>
      <p>
        <strong>작성일:</strong> {diary.date}
      </p>
      {diary.emoji && (
        <p>
          <strong>감정:</strong>{" "}
          <span className="diary-emoji">
            <img src={diary.emoji.imageUrl} alt={diary.emoji.type} width="24" />
          </span>
        </p>
      )}
      <p>{diary.content}</p>
      {diary.aiComment && <p className="ai-comment">{diary.aiComment}</p>}

      <div className="diary-buttons">
        <button className="edit" onClick={() => navigate(`/diary/edit/${date}`)}>
          수정
        </button>
        <button className="delete" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
