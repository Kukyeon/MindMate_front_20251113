import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, updateBoard } from "../api/boardApi";
import { generateAITags } from "../api/aiApi";

const BoardWritePage = ({ boardToEdit }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(boardToEdit?.title || "");
  const [content, setContent] = useState(boardToEdit?.content || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedBoard;
      if (boardToEdit) {
        // 수정 시 AI 자동 재생성
        savedBoard = await updateBoard(boardToEdit.id, { title, content });
        await generateAITags(savedBoard.id);
      } else {
        // 새 글 작성 시 AI 자동 해시태그 생성
        savedBoard = await createBoard({ title, content, accountId: 1 });
        await generateAITags(savedBoard.id);
      }
      navigate(`/board/${savedBoard.id}`);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
    }
  };

  return (
    <div>
      <h2>{boardToEdit ? "게시글 수정" : "게시글 작성"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">{boardToEdit ? "수정" : "작성"}</button>
      </form>
    </div>
  );
};

export default BoardWritePage;
