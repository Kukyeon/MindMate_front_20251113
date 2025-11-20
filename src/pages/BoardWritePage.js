import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi";
import { authHeader } from "../api/authApi";
import "./BoardWritePage.css";
import api from "../api/axiosConfig";
import { useModal } from "../context/ModalContext";

const BoardWritePage = ({ user }) => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTags, setAiTags] = useState([]);

  const userId = user?.userId;
  if (!userId) return <p>로그인이 필요합니다.</p>;
  // 임시 로그인
  //const userId = parseInt(localStorage.getItem("userId") || 2, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 게시글 생성
      const headers = await authHeader();
      const savedBoard = await createBoard({ title, content, userId }, headers);
      setAiTags(savedBoard.hashtags?.split(" ") || []);
      const boardId = savedBoard.id || savedBoard.data?.id;
      if (!boardId) throw new Error("게시글 ID를 가져오지 못했습니다.");

      //캐릭터 처리 관련
      let charResData = null;
      try {
        const charRes = await api.get(`/ai/me`, { headers });
        charResData = charRes.data;
      } catch (err) {
        if (err.response?.status === 404) {
          // 캐릭터 없음
          charResData = null;
        } else {
          throw err; // 다른 오류는 그대로 throw
        }
      }

      if (charResData) {
        // 캐릭터 존재 → 성장 처리
        await api.put("/ai/update", null, {
          params: { addPoints: 10, moodChange: 5 },
          headers,
        });
        showModal(
          "게시글이 작성되었습니다! 캐릭터가 성장했어요!",
          `/board/${boardId}`
        );
      } else {
        // 캐릭터 없음 → 생성 여부 확인
        const createChar = window.confirm(
          "게시글이 작성되었습니다!\n 캐릭터가 없어서 성장하지 못했어요.\n캐릭터를 생성할까요?"
        );
        if (createChar) {
          navigate("/profile", { state: { tab: "Character" } }); // 캐릭터 생성 페이지로 이동
        } else {
          navigate(`/board/${boardId}`); // 그냥 상세페이지로 이동
        }
      }
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      showModal("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-page">
      <h2 className="board-page-title">✏️ 게시글 작성</h2>
      <form className="board-write-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="board-input"
          required
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="board-textarea"
          required
        />
        <button type="submit" className="board-button" disabled={loading}>
          {loading ? "작성 중..." : "등록"}
        </button>
      </form>

      {aiTags.length > 0 && (
        <div className="board-ai-tags">
          <p>💡 AI 추천 해시태그:</p>
          <div className="tags-wrapper">
            {aiTags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardWritePage;
