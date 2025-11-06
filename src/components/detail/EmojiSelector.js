import { useState } from "react";
import {
  emojiList,
  toggleBoardEmoji,
  toggleCommentEmoji,
} from "../../api/emojiApi";

const EmojiSelector = ({ boardId, commentId }) => {
  const [open, setOpen] = useState(false);

  const handleSelectEmoji = async (emoji) => {
    const data = { name: emoji.name };
    if (boardId) await toggleBoardEmoji(boardId, data);
    if (commentId) await toggleCommentEmoji(commentId, data);
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)}>😊</button>
      {open && (
        <div>
          {emojiList.map((emoji) => (
            <button key={emoji.id} onClick={() => handleSelectEmoji(emoji)}>
              <img src={emoji.image} alt={emoji.name} width="20" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default EmojiSelector;
