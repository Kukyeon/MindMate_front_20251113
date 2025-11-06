import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DiaryEditor() {
  const { date } = useParams(); 
  const navigate = useNavigate();
  const [diary, setDiary] = useState({
    title: "",
    content: "",
    emoji: null,
  });

  // 1. 기존 일기 불러오기 (주소 수정)
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        // ⬇️ [수정됨] 경로 파라미터 대신 쿼리 파라미터 사용
        const response = await fetch(
          `http://localhost:8888/api/diary/date?date=${date}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("일기 조회 실패");
        const data = await response.json();
        setDiary(data);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
      }
    };
    fetchDiary();
  }, [date]);

  // 2. 수정 저장 처리 (주소 수정)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // ⬇️ [수정됨] 경로 파라미터 대신 쿼리 파라미터 사용
      const response = await fetch(
        `http://localhost:8888/api/diary/date?date=${date}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: diary.title,
            content: diary.content,
            emoji: diary.emoji,
           
          }),
        }
      );

      if (!response.ok) throw new Error("수정 실패");
      alert("수정되었습니다.");
      navigate(`/diary/date/${date}`); 
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
    }
  };

  // ... (handleChange 및 return 문은 동일)
  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
  };

  return (
    // ... (JSX 폼 코드는 동일)
    <div>
      <h2>일기 수정</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={diary.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={diary.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>이모지</label>
          <input
            type="text"
            name="emoji"
            value={diary.emoji ? diary.emoji.name || diary.emoji : ""}
            onChange={(e) =>
              setDiary({
                ...diary,
                emoji: { name: e.target.value }, 
              })
            }
          />
        </div>
        <button type="submit">저장</button>
        <button type="button" onClick={() => navigate(`/diary/date/${date}`)}>
          취소
        </button>
      </form>
    </div>
  );
}

export default DiaryEditor;