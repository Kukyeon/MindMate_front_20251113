import { useEffect, useState } from "react";
// ⬇️ useLocation 대신 useParams를 import 합니다.
import { useParams, useNavigate } from "react-router-dom";
import { fetchDiaryByDate } from "../api/diaryService";

export default function DiaryDetail() {
  // ⬇️ useLocation() 대신 useParams()를 사용합니다.
  const { date } = useParams(); // URL의 날짜(예: 2025-11-05)를 가져옵니다.
  const [diary, setDiary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ⬇️ 이제 date 변수에 URL에서 가져온 날짜가 정상적으로 들어옵니다.
    if (!date) return;

    const loadDiary = async () => {
      try {
        const res = await fetchDiaryByDate(date);
        setDiary(res.data); // ⬅️ API 호출 성공
      } catch (err) {
        if (err.response && err.response.status === 404) {
          alert("해당 날짜에 작성된 일기가 없습니다.");
          navigate("/diary/write", { state: { date } });
        } else {
          // 500 에러 등 (백엔드 오류가 아직 남아있다면 여기서 걸림)
          console.error("❌ fetchDiary 오류:", err);
        }
      }
    };

    loadDiary();
  }, [date, navigate]); // ⬅️ 의존성 배열에 navigate 추가

  // ⬇️ diary state에 API 응답 데이터가 채워지면 "로딩 중..."이 사라집니다.
  if (!diary) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{diary.title}</h2>
      <p>
        <strong>작성자:</strong> {diary.username}
      </p>
      <p>
        <strong>작성일:</strong> {diary.date}
      </p>
      <p>
        <strong>내용:</strong> {diary.content}
      </p>
      {/* ⬇️ AI 코멘트가 있다면 표시 (DiaryDto에 aiComment 필드 추가 후) */}
      {diary.aiComment && (
        <p style={{ fontStyle: "italic", color: "gray" }}>
          <strong>AI 코멘트:</strong> {diary.aiComment}
        </p>
      )}

      {/* ⬇️ 수정 버튼은 이미 URL 파라미터 방식이라 잘 동작합니다. */}
      <button onClick={() => navigate(`/diary/edit/${date}`)}>수정</button>
      <button onClick={() => navigate("/diary")}>목록으로</button>
    </div>
  );
}