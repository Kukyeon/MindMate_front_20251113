import React from "react";
import { emojiList } from "../api/emojiApi";

export default function DiaryEmojiPicker({ selectedEmoji, onSelectEmoji }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {emojiList.map((emoji) => (
        <button
          key={emoji.id}
          type="button"
          onClick={() => onSelectEmoji(emoji)}
          style={{
            background: "none",
            border: "none",
            padding: "1px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transform:
              selectedEmoji?.id === emoji.id ? "scale(1.5)" : "scale(1)",
          }}
        >
          <img src={emoji.image} alt={emoji.type} width="30" />
        </button>
      ))}
    </div>
  );
}
