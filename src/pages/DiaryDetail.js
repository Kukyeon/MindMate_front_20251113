import { useEffect, useState } from "react";
// 1. [필수] useLocation 대신 useParams를 import
import { useParams, useNavigate } from "react-router-dom";
import { fetchDiaryByDate } from "../api/diaryApi";

export default function DiaryDetail() {
  // 2. [필수] useParams()를 사용하여 URL에서 date 값을 가져옴
  const { date } = useParams(); 
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 3. date 변수에 URL에서 가져온 날짜가 정상적으로 들어옴
    if (!date) {
      alert("날짜 정보가 올바르지 않습니다.");
      navigate("/diary/calendar");
      return;
    }

    const loadDiary = async () => {
      try {
        setLoading(true);
        const res = await fetchDiaryByDate(date);
        setDiary(res.data); // 4. API 호출 성공 시 state에 데이터 저장
      } catch (err) {
        if (err.response && err.response.status === 404) {
          alert("해당 날짜에 작성된 일기가 없습니다.");
          navigate("/diary/write", { state: { date } });
        } else {
          console.error("❌ fetchDiary 오류:", err);
          alert("일기를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false); // 5. API 성공/실패 여부와 관계없이 로딩 종료
      }
    };

    loadDiary();
  }, [date, navigate]); 

 // 3. 일기 삭제 처리 함수
  const handleDelete = async() => {
    if(!window.confirm(`${date} 날짜의 일기를 정말로 삭제하시겠습니까?`)) { // ⬅️ '정말로' 추가
      return;
    }
  
    try {
        const response = await fetch(
            // 백엔드 DELETE API 호출 (경로 파라미터 사용)
            `http://localhost:8888/api/diary/date/${date}`, 
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.status === 200 || response.status === 204) {
            alert("일기가 삭제되었습니다.");
            navigate("/diary/calendar"); // 캘린더 메인 페이지로 이동
        } else {
            throw new Error(`삭제 실패: ${response.status}`);
        }
    } catch (error) {
        console.error("❌ handleDelete 오류:", error);
        alert("삭제 중 오류가 발생했습니다.");
    }
  };



  // 6. 로딩 중일 때 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 7. 로딩이 끝났는데 diary 데이터가 없으면 (API 실패 등)
  if (!diary) {
    return <div>일기 데이터를 불러오지 못했습니다.</div>;
  }

  // 8. 데이터가 있으면 렌더링
  return (
    <div style={{ padding: '20px' }}>
      <h2>{diary.title}</h2>
      <p><strong>작성자:</strong> {diary.username}</p>
      <p><strong>작성일:</strong> {diary.date}</p>

      {diary.emoji && (
        <p>
          <strong>감정:</strong>
          <img
            src={diary.emoji.imageUrl}
            alt={diary.emoji.type}
            width="30"
            style={{ verticalAlign: "middle", marginLeft: "5px" }}
          />
        </p>
      )}

      <p><strong>내용:</strong> {diary.content}</p>
      
      {diary.aiComment && (
        <p style={{ fontStyle: "italic", color: "gray", borderTop: "1px solid #eee", paddingTop: "10px" }}>
          <strong>AI 코멘트:</strong> {diary.aiComment}
        </p>
      )}

      <button onClick={() => navigate(`/diary/edit/${date}`)}>수정</button>
      <button onClick={() => navigate("/diary/calendar")}>캘린더로</button>
       {/* ⬇️ 6. 삭제 버튼은 폼 밖으로 분리 ⬇️ */}
     
        <button  onClick={handleDelete} >
            일기 삭제
        </button>
      
    </div>
  );
}