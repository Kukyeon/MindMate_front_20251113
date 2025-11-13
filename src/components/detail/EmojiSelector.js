import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";
import "./EmojiSelector.css";

const EmojiSelector = ({ boardId, commentId, userId }) => {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojiCounts, setEmojiCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const targetType = boardId ? "board" : "comment";
  const targetId = boardId || commentId;

  //  이모지 카운트 초기화
  const loadCounts = async () => {
    if (!targetId) return;
    try {
      const counts = await getEmojiCounts(targetId, targetType);

      // 서버에서 받은 counts 객체 기반으로 완전 덮어쓰기
      const updated = {};
      emojiList.forEach((e) => {
        const info = counts?.[e.type];
        updated[e.type] = {
          count: info?.count || 0,
          selected: info?.selected || false,
        };
      });

      setEmojiCounts(updated);
    } catch (err) {
      console.error("이모지 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [targetId]);

  //  이모지 선택
  const handleSelectEmoji = async (emoji) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    const data = {
      userId,
      type: emoji.type,
      imageUrl: emoji.image,
    };

    try {
      if (targetType === "board") await toggleBoardEmoji(targetId, data);
      else await toggleCommentEmoji(targetId, data);

      //서버 최신 데이터 다시 가져오기 (중요)
      await loadCounts();
    } catch (err) {
      console.error("이모지 토글 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emoji-selector">
      {/*  선택된 이모지 */}

      {/* 선택창 열기 버튼 */}
      <button
        className="emoji-toggle"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
      >
        👍
      </button>
      <div className="selected-emoji">
        {emojiList.map((emoji) => {
          const info = emojiCounts[emoji.type];
          if (!info || info.count === 0) return null;
          return (
            <span
              key={emoji.type}
              className={`emoji-inline ${
                info.selected ? "emoji-selected" : ""
              }`}
              onClick={() => handleSelectEmoji(emoji)}
            >
              <img src={emoji.image} alt={emoji.type} width="25" />
              <span>{info.count}</span>
            </span>
          );
        })}
      </div>

      {/*  이모지 선택 목록 */}
      {open && (
        <div className="emoji-popup">
          {emojiList.map((emoji) => {
            const info = emojiCounts[emoji.type];
            const count = info?.count || 0;
            const isSelected = info?.selected;

            return (
              <button
                key={emoji.id}
                className={`emoji-button ${isSelected ? "emoji-selected" : ""}`}
                onClick={() => handleSelectEmoji(emoji)}
                disabled={loading}
              >
                <img src={emoji.image} alt={emoji.type} width="25" />
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
