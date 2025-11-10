import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createDiary, fetchDiaryByDate } from "../api/diaryApi";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";

export default function DiaryWritePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐️ 1. setDate 제거, location.state에서 날짜를 상수로 받음
  const date = location.state?.date; 

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState(null); 

  useEffect(() => {
    // ⭐️ 2. 날짜가 없으면(잘못된 접근) 캘린더 페이지로 돌려보냄
    if (!date) {
      alert("날짜가 선택되지 않았습니다.");
      navigate("/diary"); // 캘린더 메인 페이지로 이동
      return;
    }

    const loadDiary = async () => {
      try {
        const res = await fetchDiaryByDate(date);
        if (res?.data) {
          setTitle(res.data.title);
          setContent(res.data.content);
          setEmoji(res.data.emoji);
        }
      } catch (err) {
        // 일기 없는 경우는 그냥 빈 상태 유지 (정상)
      }
    };
    loadDiary();
  }, [date, navigate]); // ⭐️ 의존성 배열에 date와 navigate 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return alert("날짜를 선택하세요.");
    if (!emoji) return alert("감정을 선택해 주세요")
    const username = localStorage.getItem("username");

    try {
      await createDiary({ title, content, username, date, emoji});
      alert("일기가 저장되었습니다.");
      navigate(`/diary/date/${date}`);
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  // 날짜가 없는 경우 로딩 처리 (useEffect의 리다이렉트가 실행되기 전)
  if (!date) return <div>날짜 정보 확인 중...</div>;

  return (
    <div>
      {/* ⬇️ 3. 뒤로가기 버튼 추가 (navigate(-1)은 브라우저의 '뒤로가기'와 동일) */}
      <button type="button" onClick={() => navigate(-1)}>
        &larr; 뒤로가기
      </button>
      
      {/* ⬇️ 4. 날짜를 input 대신 텍스트로 표시 */}
      <h2>{date} 일기 작성</h2>

      <form onSubmit={handleSubmit}>
        {/* ❌ <input type="date" ... /> 태그 삭제됨 */}

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <DiaryEmojiPicker 
          selectedEmoji={emoji} 
          onSelectEmoji={setEmoji} 
        />

        <button type="submit">저장</button>
      </form>
    </div>
  );
}