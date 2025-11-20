import React, { useState } from "react";
import { emojiList } from "../api/emojiApi";
import "./DiaryEmojiPicker.css"; // CSS 파일 따로 만들어서 적용

export default function DiaryEmojiPicker({ selectedEmoji, onSelectEmoji }) {
  const [hoveredType, setHoveredType] = useState(null);

  return (
    <div className="emoji-picker-wrapper">
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
            <div className="emoji-tooltip">{emoji.type}</div>
          )}
        </div>
      ))}
    </div>
  );
}