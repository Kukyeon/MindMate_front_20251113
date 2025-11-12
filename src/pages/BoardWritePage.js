import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, updateBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";
import "./BoardWritePage.css";

const BoardWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTags, setAiTags] = useState([]);

  // 임시 로그인
  const userId = parseInt(localStorage.getItem("userId") || 1, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 게시글 생성
      const savedBoard = await createBoard({ title, content, userId });
      const boardId = savedBoard.id || savedBoard.data?.id;
      if (!boardId) throw new Error("게시글 ID를 가져오지 못했습니다.");

      // 2. AI 해시태그 생성
      const { hashtags } = await generateHashtags(boardId);
      setAiTags(hashtags || []);

      // 3. 게시글에 해시태그 업데이트
      if (hashtags && hashtags.length > 0) {
        await updateBoard(boardId, {
          title,
          content,
          userId,
          hashtags: hashtags.join(" "),
        });
      }

      alert("게시글이 작성되었습니다!");
      navigate(`/board/${boardId}`);
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      alert("게시글 작성에 실패했습니다.");
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
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardWritePage;
