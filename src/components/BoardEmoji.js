import React, { useState } from "react";
import { emojiList } from "@/api/emojiApi";
import { toggleBoardEmoji } from "@/api/boardApi";

const BoardEmoji = ({ boardId, onEmojiUpdate }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiClick = async (emoji) => {
    setSelectedEmoji(emoji.name);
    const response = await toggleBoardEmoji({ boardId, emojiName: emoji.name });
    onEmojiUpdate(response);
  };

  return (
    <div>
      {emojiList.map((emoji) => (
        <img
          key={emoji.id}
          src={emoji.Image}
          alt={emoji.name}
          onClick={() => handleEmojiClick(emoji)}
        />
      ))}
    </div>
  );
};

export default BoardEmoji;
