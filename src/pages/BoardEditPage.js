import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBoardDetail, updateBoard } from "../api/boardApi";
import { generateHashtags } from "../api/aiApi";

const BoardEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const accountId = (() => {
    const stored = localStorage.getItem("accountId");
    return stored ? parseInt(stored, 10) : 1;
  })();

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const board = await fetchBoardDetail(id);
        if (board) {
          setTitle(board.title);
          setContent(board.content);
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };
    loadBoard();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBoard(id, { title, content, accountId });
      await generateHashtags(id);
      alert("게시글이 수정되었습니다!");
      navigate(`/board/${id}`); // 수정 후 상세 페이지로 이동
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
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
