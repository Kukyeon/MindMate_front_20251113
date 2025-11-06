import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";

const BoardWritePage = ({ accountId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountId = localStorage.getItem("accountId") || 1;

    try {
      // 게시글 저장
      const savedBoard = await createBoard({
        title,
        content,
        accountId, // 로그인된 사용자 ID
      });

      // AI 자동 해시태그 생성
      await generateHashtags(savedBoard.id);

      navigate(`/board/${savedBoard.id}`);
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2>✏️ 게시글 작성</h2>
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
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default BoardWritePage;
