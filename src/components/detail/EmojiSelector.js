import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";
import "./EmojiSelector.css";
import { useNavigate } from "react-router-dom";

const EmojiSelector = ({ boardId, commentId, userId }) => {
  const [open, setOpen] = useState(false);
  const [emojiCounts, setEmojiCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const targetType = boardId ? "board" : "comment";
  const targetId = boardId || commentId;

  // 서버에서 이모지 카운트 불러오기
  const loadCounts = async () => {
    if (!targetId) return;
    try {
      const counts = await getEmojiCounts(targetId, targetType);
      const updated = {};
      emojiList.forEach((e) => {
        const info = counts?.[e.type];
        updated[e.type] = {
          count: info?.count || 0,
          selected: info?.selected || false,
          image: e.image,
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

  // 클릭 즉시 UI 반영 + 서버 동기화 (Optimistic UI)
  const handleSelectEmoji = async (emoji) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const info = emojiCounts[emoji.type];
    const isAlreadySelected = info?.selected;

    // 선택 여부에 따라 count 변경
    const newSelected = isAlreadySelected ? false : true;
    const newCount = isAlreadySelected ? info.count - 1 : info.count + 1;

    // UI 먼저 업데이트
    setEmojiCounts((prev) => ({
      ...prev,
      [emoji.type]: {
        ...prev[emoji.type],
        selected: newSelected,
        count: newCount,
      },
    }));

    setOpen(false);
    setLoading(true);

    const data = { userId, type: emoji.type, imageUrl: emoji.image };

    try {
      if (targetType === "board") await toggleBoardEmoji(targetId, data);
      else await toggleCommentEmoji(targetId, data);

      await loadCounts();
    } catch (err) {
      console.error("이모지 토글 실패:", err);

      // 실패 시 롤백
      setEmojiCounts((prev) => ({
        ...prev,
        [emoji.type]: info,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emoji-selector">
      <div className="emoji-header">
        {/* 토글 버튼 */}
        <button
          className="emoji-toggle"
          onClick={() => setOpen((prev) => !prev)}
        >
          {emojiList.slice(0, 3).map((e) => (
            <img key={e.type} src={e.image} alt={e.type} width="20" />
          ))}
        </button>

        {/* 버튼 옆 선택된 이모지 + 숫자 표시 */}
        <div className="selected-emoji">
          {emojiList.map((emoji) => {
            const info = emojiCounts[emoji.type];
            if (!info || info.count === 0) return null;
            return (
              <span
                key={emoji.type}
                className="emoji-inline"
                onClick={() => handleSelectEmoji(emoji)}
              >
                <img src={emoji.image} alt={emoji.type} width="25" />
                <span className="emoji-count">{info.count}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* 밑 슬라이드 리스트 */}
      <div className={`emoji-list ${open ? "open" : ""}`}>
        {emojiList.map((emoji) => (
          <button
            key={emoji.type}
            className={`emoji-button ${
              emojiCounts[emoji.type]?.selected ? "emoji-selected" : ""
            }`}
            onClick={() => handleSelectEmoji(emoji)}
            disabled={loading}
          >
            <img src={emoji.image} alt={emoji.type} width="25" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;
