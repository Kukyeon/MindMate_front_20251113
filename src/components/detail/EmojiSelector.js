import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";

const EmojiSelector = ({ boardId, commentId }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // { type, image } 저장
  const [emojiCounts, setEmojiCounts] = useState({});

  // ✅ 이모지 카운트 불러오기
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const targetType = boardId ? "board" : "comment";
        const id = boardId || commentId;
        const counts = await getEmojiCounts(id, targetType);
        setEmojiCounts(counts);
      } catch (err) {
        console.error("이모지 카운트 로드 실패:", err);
      }
    };
    loadCounts();
  }, [boardId, commentId]);

  // ✅ 이모지 클릭 핸들러
  const handleSelectEmoji = async (emoji) => {
    const type = emoji.type;
    setOpen(false);

    // 낙관적 UI 업데이트 (먼저 +1)
    setEmojiCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    try {
      const data = { type, imageUrl: emoji.image };
      if (boardId) await toggleBoardEmoji(boardId, data);
      if (commentId) await toggleCommentEmoji(commentId, data);

      setSelected(emoji); // 전체 객체 저장
    } catch (err) {
      console.error("이모지 전송 실패:", err);
      alert("이모지 등록 중 오류가 발생했습니다.");

      // 실패 시 되돌림
      setEmojiCounts((prev) => ({
        ...prev,
        [type]: Math.max((prev[type] || 1) - 1, 0),
      }));
    }
  };

  return (
    <div>
      {/* 선택된 이모지 or 기본표시 */}
      <button onClick={() => setOpen(!open)}>
        {selected ? (
          <img src={selected.image} alt={selected.type} width="20" />
        ) : (
          "😊"
        )}
      </button>

      {/* 이모지 목록 */}
      {open && (
        <div>
          {emojiList.map((emoji) => (
            <button key={emoji.id} onClick={() => handleSelectEmoji(emoji)}>
              <img src={emoji.image} alt={emoji.type} width="20" />
              {emojiCounts[emoji.type] > 0 && (
                <span> {emojiCounts[emoji.type]}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
