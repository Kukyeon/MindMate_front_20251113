import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";

const BoardEditPage = ({ accountId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadBoard = async () => {
      const board = await fetchBoardDetail(id);
      setTitle(board.title);
      setContent(board.content);
    };
    loadBoard();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBoard(id, { title, content, accountId });
      await generateHashtags(id);
      navigate(`/board/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
    }
  };

  return (
    <div>
      <h2>✏️ 게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목을 수정하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 수정하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default BoardEditPage;
