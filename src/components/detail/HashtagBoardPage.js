import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import EmojiSelector from "./EmojiSelector"; // 게시글용 이모지 컴포넌트
import BoardList from "../board/BoardList";

const HashtagBoardPage = ({ userId }) => {
  const { tag } = useParams();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const cleanTag = decodeURIComponent(tag);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/boards/hashtag/${cleanTag}`);
        setBoards(res.data);
      } catch (err) {
        console.error(err);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [cleanTag]);

  return (
    <div className="board-page">
      <h2 className="board-page-title">{cleanTag} 관련 게시글</h2>

      {loading ? (
        <p className="loading">로딩중...</p>
      ) : boards.length === 0 ? (
        <p className="board-empty">해당 해시태그 게시글이 없습니다.</p>
      ) : (
        // <div className="board-list-cards">
        //   {boards.map((board) => (
        //     <div
        //       key={board.id}
        //       className={`board-item-card ${board.pinned ? "board-admin" : ""}`}
        //     >
        //       <div className="board-header-card">
        //         <div className="board-header-top">
        //           <Link to={`/board/${board.id}`} className="board-title">
        //             {board.title}
        //           </Link>
        //           <span className="board-meta">
        //             작성자: {board.writer} | 조회수: {board.viewCount}
        //           </span>
        //         </div>
        //         {board.hashtags && (
        //           <div className="board-hashtag-emoji-card">
        //             {board.hashtags.split(" ").map((ht) => (
        //               <span key={ht} className="board-hashtag-card">
        //                 {ht}
        //               </span>
        //             ))}
        //           </div>
        //         )}
        //       </div>
        //       <div className="board-content-card">{board.content}</div>

        //       {/* 게시글용 이모지 */}
        //       <div className="board-emoji-hashtag-card">
        //         <EmojiSelector boardId={board.id} userId={userId} />
        //       </div>
        //     </div>
        //   ))}
        // </div>
        <BoardList
          boards={boards}
          page={0}
          size={boards.length}
          totalElements={boards.length}
          showAllButton={true} 
        />
      )}
    </div>
  );
};

export default HashtagBoardPage;
