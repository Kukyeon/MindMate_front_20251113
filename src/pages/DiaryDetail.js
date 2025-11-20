// DiaryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDiaryByDate } from "../api/diaryApi";
import { deleteDiaryByDate } from "../api/diaryApi";
import { useModal } from "../context/ModalContext";

export default function DiaryDetail({ dateFromCalendar, onDelete }) {
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showModal } = useModal();
  const params = useParams();
  const date = dateFromCalendar || params.date;

  useEffect(() => {
    if (!date) {
      navigate("/diary/calendar");
      return;
    }

    const loadDiary = async () => {
      try {
        setLoading(true);
        const res = await fetchDiaryByDate(date);
        setDiary(res.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) {
          showModal("해당 날짜에 작성된 일기가 없습니다.", () => {
            navigate("/diary/write", { state: { date } });
          });
        } else if (status === 403) {
          showModal("로그인이 필요합니다.", "/login");
        } else {
          showModal("일기를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDiary();
  }, [date, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`${date} 날짜의 일기를 정말로 삭제하시겠습니까?`))
      return;

    try {
      await deleteDiaryByDate(date);
      showModal("일기가 삭제되었습니다.");
      setDiary(null);
      if (onDelete) onDelete(date);
    } catch (err) {
      showModal("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!diary) return <div>일기 데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="diary-detail-wrapper">
      <h2>{diary.title}</h2>

      <div className="detail-meta">
        <p><strong>작성자:</strong> {diary.nickname}</p>
        <p><strong>작성일:</strong> {diary.date}</p>
        {diary.emoji && (
          <p>
            <strong>감정:</strong>{" "}
            <span className="diary-emoji">
              <img src={diary.emoji.imageUrl} alt={diary.emoji.type} width="26" />
            </span>
          </p>
        )}
      </div>

      <div className="diary-content">{diary.content}</div>

      {diary.imageUrl && (
        <div className="diary-image">
          <img
            src={`http://localhost:8888${diary.imageUrl}`}
            alt="Diary"
            style={{ maxWidth: "50%", marginTop: "12px" }}
          />
        </div>
      )}

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
