import React, { useState } from "react";
import { emojiList } from "../api/emojiApi";
import "./DiaryEmojiPicker.css"; // CSS 파일 따로 만들어서 적용

export default function DiaryEmojiPicker({
  selectedEmoji,
  onSelectEmoji,
  recommended = [],
}) {
  const [hoveredType, setHoveredType] = useState(null);
  // 추천된 AI 이모지를 emojiList 객체로 변환
  const recommendedEmojis = recommended
    .map((type) => emojiList.find((e) => e.type === type))
    .filter(Boolean); // 찾지 못한 것은 제거

  // 렌더링할 이모지 배열 (추천 + 전체)
  const displayEmojis = [...recommendedEmojis, ...emojiList];
  return (
    <div className="emoji-picker-wrapper">
      {/* 추천 이모지 먼저 */}
      {recommendedEmojis.length > 0 && (
        <div className="recommended-emoji">
          <p>추천 이모지:</p>
          {recommendedEmojis.map((emoji) => (
            <button
              key={emoji.id}
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className={selectedEmoji?.id === emoji.id ? "selected" : ""}
            >
              <img src={emoji.image} alt={emoji.type} width="30" />
            </button>
          ))}
        </div>
      )}
      <div className="all-emoji">
        {emojiList.map((emoji) => (
          <div
            key={emoji.id}
            className="emoji-button-wrapper"
            onMouseEnter={() => setHoveredType(emoji.type)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <button
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className={selectedEmoji?.id === emoji.id ? "selected" : ""}
            >
              <img src={emoji.image} alt={emoji.type} width="30" />
            </button>
            {hoveredType === emoji.type && (
              <div className="emoji-tooltip">
                {recommendedEmojis.includes(emoji)
                  ? `${emoji.type} (추천)`
                  : emoji.type}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
