import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const HashtagBoardPage = () => {
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
    <div>
      <h2>{cleanTag} 관련 게시글</h2>
      {loading ? (
        <p>로딩중...</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board.id}>
              <Link to={`/board/${board.id}`}>{board.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HashtagBoardPage;
