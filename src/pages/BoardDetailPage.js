import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import EmojiSelector from "../components/detail/EmojiSelector";
import CommentForm from "../components/comment/CommentForm";
import CommentList from "../components/comment/CommentList";
import HashtagList from "../components/detail/HashtagList";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  //  임시 로그인 (accountId 기본값 1)
  const accountId = (() => {
    const stored = localStorage.getItem("accountId");
    return stored ? parseInt(stored, 10) : 1;
  })();

  // 게시글 조회
  const fetchBoard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/boards/${id}`);
      if (response.data) setBoard(response.data);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  //  수정 버튼
  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };

  //  삭제 버튼
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/boards/${id}`);
      alert("삭제되었습니다.");
      navigate("/boards");
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  if (loading) return <div>불러오는 중...</div>;
  if (!board) return <div>게시글 정보를 찾을 수 없습니다.</div>;

  //const isMyPost = board.accountId === accountId;

  const isMyPost =
    board.accountId === accountId ||
    board.writer === "익명" || // 익명 글 테스트 시
    true;

  //  해시태그 자동 처리 (문자열 / 배열 모두 대응)
  let tagData = board.hashtags;
  if (typeof tagData === "string") {
    tagData = tagData
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.startsWith("#"));
  }

  return (
    <div>
      <h2>{board.title}</h2>
      <p>{board.content}</p>
      <p>작성자: {board.authorName || "익명"}</p>

      {/*  해시태그 표시 */}
      {tagData && tagData.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <strong>해시태그 : </strong>
          <HashtagList hashtags={tagData} />
        </div>
      )}

      {/*  이모지 선택 */}
      <EmojiSelector boardId={board.id} />

      {/*  본인 글일 때만 수정/삭제 표시 */}
      {isMyPost && (
        <div>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}

      {/*  댓글 */}
      <CommentForm
        accountId={accountId}
        boardId={board.id}
        onCommentAdded={fetchBoard}
      />
      <CommentList boardId={board.id} />
    </div>
  );
};

export default BoardDetailPage;
