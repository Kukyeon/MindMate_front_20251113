// DiaryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const res = await fetch(`http://localhost:8888/api/diary/date?date=${date}`,{
          headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔑 필수
  }
        });
        
        if (res.ok) {
          const data = await res.json();
          setDiary(data);
        } else if (res.status === 404) {
          alert("해당 날짜에 작성된 일기가 없습니다.");
          navigate("/diary/write", { state: { date } });
        } else {
          throw new Error(`HTTP 오류: ${res.status}`);
        }
      } catch (err) {
        console.error("❌ fetchDiary 오류:", err);
        alert("일기를 불러오는 중 오류가 발생했습니다.");
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
      const response = await fetch(`http://localhost:8888/api/diary/date/${date}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        alert("일기가 삭제되었습니다.");
        setDiary(null);
        if (onDelete) onDelete(date); // 캘린더 상태 갱신
      } else {
        throw new Error(`삭제 실패: ${response.status}`);
      }
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
        <strong>작성자:</strong> {diary.username}
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
