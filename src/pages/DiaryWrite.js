import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createDiary, fetchDiaryByDate } from "../api/diaryApi";
import { authHeader, getUser } from "../api/authApi"; // 서버에서 사용자 정보 가져오기
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import api from "../api/axiosConfig";


export default function DiaryWritePage() {
  const location = useLocation();
  const navigate = useNavigate();
  // ⭐️ 로그인 체크
  //const token = localStorage.getItem("accessToken");
  // ⭐️ 1. setDate 제거, location.state에서 날짜를 상수로 받음
  const date = location.state?.date;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState({});
  const [user, setUser] = useState(null); // 서버에서 가져온 사용자 정보
  const [loadingUser, setLoadingUser] = useState(true);

   useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const currentUser = await getUser();
      if (!currentUser) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      setUser(currentUser);
      setLoadingUser(false);
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!date) {
      alert("날짜가 선택되지 않았습니다.");
      navigate("/diary");
      return;
    }
    
    const loadDiary = async () => {
      try {
       const res = await fetchDiaryByDate(date, user?.accessToken);
        if (res?.data) {
          setTitle(res.data.title || "");
          setContent(res.data.content || "");
          setEmoji(res.data.emoji || {});
        }
      } catch (err) {
        // 일기 없는 경우는 그대로
      }
    };
    loadDiary();
  }, [date, navigate]);

  const [isSaving, setIsSaving] = useState(false);
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!date) return alert("날짜를 선택하세요.");
  if (!emoji) return alert("감정을 선택해 주세요");
  if (!user?.userId) return alert("로그인이 필요합니다.");
  if (isSaving) return;

  setIsSaving(true);

  try {
    // 1️⃣ 일기 저장
    await createDiary({ title, content, userId: user.userId, nickname: user.nickname, date, emoji });
    
    // 2️⃣ 캐릭터 처리
    const headers = await authHeader();
    let charResData = null;
    try {
      const charRes = await api.get(`/ai/me`, { headers });
      charResData = charRes.data;
    } catch (err) {
      if (err.response?.status === 404) {
        charResData = null; // 캐릭터 없음
      } else {
        throw err;
      }
    }

    if (charResData) {
      // 캐릭터 존재 → 성장 처리
      await api.put("/ai/update", null, {
        params: { addPoints: 10, moodChange: 5 },
        headers,
      });
      alert("일기가 저장되었습니다! 캐릭터가 성장했어요!");
      navigate("/diary/calendar", { state: { selectedDate: date } });
    } else {
      // 캐릭터 없음 → 생성 여부 확인
      const createChar = window.confirm(
        "일기가 저장되었습니다!\n 캐릭터가 없어서 성장하지 못했어요.\n캐릭터를 생성할까요?"
      );
      if (createChar) {
        navigate("/profile", { state: { tab: "Character" } });
      } else {
        navigate("/diary/calendar", { state: { selectedDate: date } });
      }
    }

  } catch (err) {
    console.error("일기 저장 실패:", err);
    alert("일기 저장에 실패했습니다.");
  } finally {
    setIsSaving(false);
  }
};
  if (loadingUser) return <div>사용자 정보 로딩 중...</div>;
  if (!user?.userId) return <p>로그인이 필요합니다.</p>;
  if (!date) return <div>날짜 정보 확인 중...</div>;  

  return (
    <div className="diary-write-card">
      <button type="button" onClick={() => navigate(-1)}>
        &larr; 뒤로가기
      </button>

      <h2>✍️ {date} 일기 작성</h2>

      <form onSubmit={handleSubmit}>
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
        <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />

        <div className="diary-write-buttons">
          <button type="submit">저장</button>
          <button
            type="button"
            onClick={() =>
              navigate("/diary/calendar", { state: { selectedDate: date } })
            }
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
