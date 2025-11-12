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

  // ⚡ 임시 로그인 (임시로 userId 1번 유저로 처리)
  //const userId = parseInt(localStorage.getItem("userId") || 1, 10);

  // ⚡ 실제 로그인 적용 시 (예: JWT 기반 로그인)
  /*
  import { useAuth } from "../context/AuthContext"; 
  const { user } = useAuth(); 
  const userId = user?.id; // 로그인된 유저의 id를 받아옴
  */
  const userId = user?.id;

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const headers = await authHeader();
      const res = await api.get(`/api/boards/${id}`, { headers });
      //if (response.data) setBoard(response.data);
      setBoard(res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
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

  // ✅ 본인 게시글 여부 판단 (writer가 User.nickname과 연동될 경우)
  //const isMyPost = board.writerId === userId;

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
            <button className="board-btn edit" onClick={handleEdit}>
              수정
            </button>
            <button className="board-btn delete" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
        <div className="board-meta">
          <span>작성자: {board.writer || board.user?.nickname}</span>
          <span>{new Date(board.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 본문 카드 */}
      <div className="board-content-card">
        <p>{board.content}</p>
      </div>

      {/* 해시태그 + 이모지 */}

      <div className="board-hashtag-emoji-card">
        {tagData?.length > 0 && <HashtagList hashtags={tagData} />}
        <EmojiSelector boardId={board.id} user={user} />
      </div>

      {/* 댓글 영역 */}
      <div className="board-comment-section">
        <CommentForm
          userId={userId}
          boardId={board.id}
          onCommentAdded={fetchBoard}
        />
        <CommentList boardId={board.id} user={user} ref={commentListRef} />
      </div>

      {/* 하단 목록 버튼 */}
      <button className="board-btn back" onClick={() => navigate("/boards")}>
        목록으로
      </button>
    </div>
  );
};

export default BoardDetailPage;
