import React from "react";
// emojiList를 API 파일에서 가져옵니다. (경로는 실제 위치에 맞게 수정)
import { emojiList } from "../api/emojiApi"; 

export default function DiaryEmojiPicker({ selectedEmoji, onSelectEmoji }) {
  return (
    <div>
      <p>오늘의 기분:</p>
      {emojiList.map((emoji) => (
        <button
          key={emoji.id}
          type="button" // 폼 submit 방지
          onClick={() => onSelectEmoji(emoji)}
          style={{
            // 선택된 이모지에 테두리 표시
            border: selectedEmoji?.id === emoji.id ? "2px solid blue" : "1px solid gray",
            margin: "4px",
            background: "none",
            padding: "4px",
          }}
        >
          <img src={emoji.image} alt={emoji.type} width="30" />
        </button>
      ))}
    </div>
  );
}