import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import EmojiSelector from "../components/detail/EmojiSelector";
import CommentForm from "../components/comment/CommentForm";
import CommentList from "../components/comment/CommentList";
import HashtagList from "../components/detail/HashtagList";
import { authHeader } from "../api/authApi";

const BoardDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const commentListRef = useRef();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = user?.userId || null;

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const headers = user ? await authHeader() : {};

      const res = await api.get(`/api/boards/${id}`, { headers });
      //if (response.data) setBoard(response.data);
      setBoard(res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      alert("게시글을 불러오지 못했습니다.");
      navigate("/boards");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!userId) return alert("로그인이 필요합니다.");
    navigate(`/board/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const headers = await authHeader();
      await api.delete(`/api/boards/${id}`, { headers });
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

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (!board)
    return <div className="not-found">게시글 정보를 찾을 수 없습니다.</div>;

  // ✅ 해시태그 안전 처리
  let tagData = [];
  if (typeof board?.hashtags === "string") {
    tagData = board.hashtags
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.startsWith("#"));
  } else if (Array.isArray(board?.hashtags)) {
    tagData = board.hashtags;
  }

  return (
    <div className="board-detail-page">
      {/* 상단 카드: 제목 + 작성자 + 작성일 + 수정/삭제 */}
      <div className="board-header-card">
        <div className="board-header-top">
          <h2 className="board-title">{board.title}</h2>

          <div className="board-actions">
            {userId && board.writerId === user.userId && (
              <>
                <button className="board-btn edit" onClick={handleEdit}>
                  수정
                </button>
                <button className="board-btn delete" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
        <div className="board-meta">
          <span>작성자: {board.writer || board.user?.nickname}</span>
          <span>{board.createdAt}</span>
        </div>
      </div>

      {/* 본문 카드 */}
      <div className="board-content-card">
        <p>{board.content}</p>
      </div>

      {/* 해시태그 + 이모지 */}
      <div className="board-emoji-hashtag-card">
        <div className="board-emoji-card">
          {tagData?.length > 0 && <HashtagList hashtags={tagData} />}
        </div>
        <div className="board-hashtag-card">
          <EmojiSelector boardId={board.id} userId={userId} disabled={!user} />
        </div>
      </div>
      {/* 댓글 영역 */}
      <div className="board-comment-section">
        {user ? (
          <CommentForm
            userId={userId}
            boardId={board.id}
            onCommentAdded={fetchBoard}
          />
        ) : (
          <div className="comment-login-alert">
            💬 댓글을 작성하려면 로그인하세요.
          </div>
        )}
        <CommentList boardId={board.id} userId={userId} ref={commentListRef} />
      </div>

      {/* 하단 목록 버튼 */}
      <button className="board-btn back" onClick={() => navigate("/boards")}>
        목록으로
      </button>
    </div>
  );
};

export default BoardDetailPage;
