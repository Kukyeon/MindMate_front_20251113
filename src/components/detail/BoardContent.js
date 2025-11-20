import { useEffect, useState } from "react";
import EmojiSelector from "./EmojiSelector";
import HashtagList from "./HashtagList";
import { generateHashtags } from "../../api/aiApi"; //  AI 해시태그 함수 import

const BoardContent = ({ board, user }) => {
  const [hashtags, setHashtags] = useState(board?.hashtags || []);
  const userId = user.userId;

  useEffect(() => {
    // 게시글 내용이 있고, 기존 해시태그가 비어 있을 때만 AI 호출
    if (board?.id && (!board.hashtags || board.hashtags.length === 0)) {
      (async () => {
        const { hashtags: aiTags } = await generateHashtags(board.id);
        if (aiTags && aiTags.length > 0) {
          setHashtags(aiTags);
        }
      })();
    } else {
      setHashtags(board.hashtags);
    }
  }, [board]);

  return (
    <div>
      <h2>{board.title}</h2>
      <p>작성자: {board.writer}</p>
      <p>조회수: {board.viewCount}</p>
      <div>{board.content}</div>
      <br />
      <hr />
      <br />
      {/*해시태그*/}
      {hashtags && hashtags.length > 0 && <HashtagList hashtags={hashtags} />}
      <br />
      <hr />
      <br />
      {/*이모지*/}
      <EmojiSelector boardId={board.id} userId={userId} />
    </div>
  );
};
export default BoardContent;
