import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, updateBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";

const BoardWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚡ 임시 로그인
  const userId = parseInt(localStorage.getItem("userId") || 1, 10);

  // ⚡ 실제 로그인 적용 시
  // const userId = 현재 로그인 유저 ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️ 게시글 저장
      const savedBoard = await createBoard({ title, content, userId });
      const boardId = savedBoard.id || savedBoard.data?.id;
      if (!boardId) throw new Error("게시글 ID를 가져오지 못했습니다.");

      // 2️ AI 해시태그 생성
      const { hashtags: aiTags } = await generateHashtags(boardId);

      // 3️ AI가 생성한 해시태그를 Board DB에 업데이트
      if (aiTags && aiTags.length > 0) {
        await updateBoard(boardId, {
          title,
          content,
          userId,
          hashtags: aiTags.join(" "),
        });
      }

      alert("게시글이 작성되었습니다!");
      navigate(`/board/${boardId}`); // 상세보기 이동
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? "작성 중..." : "등록"}
        </button>
      </form>
    </div>
  );
};

export default BoardWritePage;
