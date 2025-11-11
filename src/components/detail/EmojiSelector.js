import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";
import "./EmojiSelector.css";

const EmojiSelector = ({ boardId, commentId }) => {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojiCounts, setEmojiCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const accountId = (() => {
    const stored = localStorage.getItem("accountId");
    return stored ? parseInt(stored, 10) : 1;
  })();

  //  이모지 카운트 초기화
  const loadCounts = async () => {
    const targetType = boardId ? "board" : "comment";
    const id = boardId || commentId;
    if (!id) return;

    try {
      const counts = await getEmojiCounts(id, targetType);

      // 서버에서 받은 counts 객체 기반으로 완전 덮어쓰기
      const updatedCounts = {};
      emojiList.forEach((e) => {
        const info = counts?.[e.type];
        updatedCounts[e.type] = {
          count: info?.count || 0,
          selected: info?.selected || false,
        };
      });

      setEmojiCounts(updatedCounts);

      // 선택된 이모지 찾기
      const selected = Object.keys(updatedCounts).find(
        (key) => updatedCounts[key].selected
      );
      setSelectedEmoji(selected || null);
    } catch (err) {
      console.error("이모지 카운트 로드 실패:", err);
    }
  };

  useEffect(() => {
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, commentId]);

  //  이모지 선택
  const handleSelectEmoji = async (emoji) => {
    if (loading) return;
    setLoading(true);

    const data = {
      accountId,
      type: emoji.type,
      imageUrl: emoji.image,
    };

    try {
      if (boardId) await toggleBoardEmoji(boardId, data);
      if (commentId) await toggleCommentEmoji(commentId, data);

      // 선택 토글
      const newSelected = selectedEmoji === emoji.type ? null : emoji.type;

      // ⚡ 한 번에 하나만 선택 가능 — 나머지 초기화
      const newCounts = Object.fromEntries(
        Object.entries(emojiCounts).map(([key, val]) => [
          key,
          {
            count:
              key === newSelected
                ? (val.count || 0) + (selectedEmoji === emoji.type ? -1 : 1)
                : 0,
            selected: key === newSelected,
          },
        ])
      );

      setEmojiCounts(newCounts);
      setSelectedEmoji(newSelected);
      setOpen(false);
    } catch (err) {
      console.error("이모지 토글 실패:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const selectedData = selectedEmoji
    ? emojiList.find((e) => e.type === selectedEmoji)
    : null;

  return (
    <div className="emoji-selector">
      {/*  선택된 이모지 */}

      {/* 선택창 열기 버튼 */}
      <button
        className="emoji-toggle"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
      ></button>
      {selectedEmoji && (
        <div
          className="selected-emoji"
          onClick={() => handleSelectEmoji(selectedData)}
        >
          <img src={selectedData.image} alt={selectedData.type} width="30" />
          <span>{emojiCounts[selectedEmoji]?.count || 0}</span>
        </div>
      )}

      {/*  이모지 선택 목록 */}
      {open && (
        <div className="emoji-popup">
          {emojiList.map((emoji) => {
            const info = emojiCounts[emoji.type];
            const count = info?.count || 0;
            const isSelected = selectedEmoji === emoji.type;

            return (
              <button
                key={emoji.id}
                className={`emoji-button ${isSelected ? "emoji-selected" : ""}`}
                onClick={() => handleSelectEmoji(emoji)}
                disabled={loading}
              >
                <img src={emoji.image} alt={emoji.type} width="25" />
                {count > 0 && (
                  <span>
                    {count}
                    {/* {isSelected ? "⚡" : ""} */}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
