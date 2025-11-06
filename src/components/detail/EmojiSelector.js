import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";

const EmojiSelector = ({ boardId, commentId }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // { name, image } 저장
  const [emojiCounts, setEmojiCounts] = useState({});

  //  이모지 카운트 불러오기
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const type = boardId ? "board" : "comment";
        const id = boardId || commentId;
        const counts = await getEmojiCounts(id, type);
        setEmojiCounts(counts);
      } catch (err) {
        console.error("이모지 카운트 로드 실패:", err);
      }
    };
    loadCounts();
  }, [boardId, commentId]);

  // 이모지 클릭 핸들러
  const handleSelectEmoji = async (emoji) => {
    const name = emoji.name;
    setOpen(false);

    // 낙관적 UI 업데이트
    setEmojiCounts((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1,
    }));

    try {
      const data = { name };
      if (boardId) await toggleBoardEmoji(boardId, data);
      if (commentId) await toggleCommentEmoji(commentId, data);

      setSelected(emoji); // 전체 객체 저장
    } catch (err) {
      console.error("이모지 전송 실패:", err);
      alert("이모지 등록 중 오류가 발생했습니다.");

      // 실패 시 되돌림
      setEmojiCounts((prev) => ({
        ...prev,
        [name]: Math.max((prev[name] || 1) - 1, 0),
      }));
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {selected ? (
          <img src={selected.image} alt={selected.name} width="20" />
        ) : (
          "😊"
        )}
      </button>

      {open && (
        <div>
          {emojiList.map((emoji) => (
            <button key={emoji.id} onClick={() => handleSelectEmoji(emoji)}>
              <img src={emoji.image} alt={emoji.name} width="20" />
              {emojiCounts[emoji.name] > 0 && (
                <span> {emojiCounts[emoji.name]}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
