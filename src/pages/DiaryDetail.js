import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DiaryDetail() {
  const { id } = useParams(); // URL에서 일기 ID 가져오기 (예: /diary/3)
  const [diary, setDiary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await fetch(`http://localhost:8080/diary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT 토큰 사용
          },
        });
        if (!response.ok) throw new Error("일기 조회 실패");
        const data = await response.json();
        setDiary(data);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
      }
    };
    fetchDiary();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const response = await fetch(`http://localhost:8080/diary/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("삭제 실패");
      alert("삭제되었습니다.");
      navigate("/diary"); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error("❌ handleDelete 오류:", error);
    }
  };

  if (!diary) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>{diary.title}</h2>
      <p>
        <strong>작성자:</strong> {diary.username}
      </p>
      <p>
        <strong>작성일:</strong> {diary.createdate}
      </p>
      {diary.emoji && (
        <p>
          <strong>이모지:</strong> {diary.emoji.name}
        </p>
      )}
      <p>
        <strong>내용:</strong>
      </p>
      <p>{diary.content}</p>

      {diary.aiComment && (
        <>
          <hr />
          <p>
            <strong>AI 코멘트:</strong>
          </p>
          <p>{diary.aiComment}</p>
        </>
      )}

      <button onClick={() => navigate(`/diary/edit/${id}`)}>수정</button>
      <button onClick={handleDelete}>삭제</button>
      <button onClick={() => navigate("/diary")}>목록으로</button>
    </div>
  );
}

export default DiaryDetail;
