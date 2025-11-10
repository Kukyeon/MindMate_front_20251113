import { useEffect, useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
  getEmojiCounts,
} from "../../api/emojiApi";

const EmojiSelector = ({ boardId, commentId }) => {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojiCounts, setEmojiCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const accountId = (() => {
    const stored = localStorage.getItem("accountId");
    return stored ? parseInt(stored, 10) : 1;
  })();

  const loadCounts = async () => {
    const targetType = boardId ? "board" : "comment";
    const id = boardId || commentId;
    if (!id) return;

    try {
      const counts = await getEmojiCounts(id, targetType);
      if (typeof counts === "object" && !Array.isArray(counts)) {
        setEmojiCounts(counts);
        const selected = Object.keys(counts).find(
          (key) => counts[key].selected === true
        );
        setSelectedEmoji(selected || null);
      }
    } catch (err) {
      console.error("이모지 카운트 로드 실패:", err);
    }
  };

  useEffect(() => {
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, commentId]);

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

      setSelectedEmoji((prev) => (prev === emoji.type ? null : emoji.type));
      await loadCounts();
    } catch (err) {
      console.error("이모지 토글 실패:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      {selectedEmoji && (
        <div
          onClick={() =>
            handleSelectEmoji({
              type: selectedEmoji,
              image: emojiList.find((e) => e.type === selectedEmoji)?.image,
            })
          }
        >
          <img
            src={emojiList.find((e) => e.type === selectedEmoji)?.image}
            alt={selectedEmoji}
            width="30"
          />
          <span>
            {emojiCounts[selectedEmoji] ? emojiCounts[selectedEmoji].count : 1}
          </span>
        </div>
      )}

      <button onClick={() => setOpen(!open)}>😊</button>

      {open && (
        <div>
          {emojiList.map((emoji) => {
            const info = emojiCounts[emoji.type];
            const count = info?.count || 0;
            const isSelected = selectedEmoji === emoji.type;

            return (
              <button
                key={emoji.id}
                onClick={() => handleSelectEmoji(emoji)}
                disabled={loading}
              >
                <img src={emoji.image} alt={emoji.type} width="25" />
                {count > 0 && (
                  <span>
                    {count}
                    {isSelected ? "⚡" : ""}
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
