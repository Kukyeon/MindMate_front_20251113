import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../component/DiaryEmojiPicker";

export default function DiaryEditor() {
  const { date } = useParams(); 
  const navigate = useNavigate();
  
  const [emoji, setEmoji] = useState(null); 
  
  const [diary, setDiary] = useState({
    title: "",
    content: "",
    username: "",
  });

  // 1. 기존 일기 불러오기
  useEffect(() => {
    if (!date) return;
    const fetchDiary = async () => {
      try {
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
        setEmoji(data.emoji);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
      }
    };
    fetchDiary();
  }, [date, navigate]); // ⬅️ 의존성 배열에 navigate 추가

  // 2. 수정 저장 처리
  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) return alert("날짜를 선택하세요.");
    if (!emoji) return alert("감정을 선택해 주세요");

    const { id, type, imageUrl } = emoji; 
    const dataToSend = {
      title: diary.title, 
      content: diary.content,
      emoji: { id, type, imageUrl } 
    }
    
    try {
      const response = await fetch(
        `http://localhost:8888/api/diary/date?date=${date}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dataToSend), 
        }
      );

      if (!response.ok) throw new Error("수정 실패");
      alert("수정되었습니다.");
      navigate(`/diary/date/${date}`); 
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

 


  // 4. 제목/내용 변경 핸들러
  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
  };


  return (
    <div style={{ padding: '20px' }}>
      <h2>{date} 일기 수정</h2>
      <form onSubmit={handleSave}>
        {/* ... (title, content input들) ... */}
        <div>
          <label>제목</label>
          <input type="text" name="title" value={diary.title} onChange={handleChange} required />
        </div>
        <div>
          <label>내용</label>
          <textarea name="content" value={diary.content} onChange={handleChange} required />
        </div>
        {/* 9. EmojiPicker */}
        <DiaryEmojiPicker 
          selectedEmoji={emoji} 
          onSelectEmoji={setEmoji} 
        />

        {/* ⬇️ 5. 폼 액션 버튼 그룹 */}
        <div >
            <button type="submit" >저장</button>
            <button type="button" onClick={() => navigate(`/diary/date/${date}`)}>
              취소
            </button>
        </div>
      </form>

     
    </div>
  );
}