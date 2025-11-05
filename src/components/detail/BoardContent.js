const BoardContent = ({ board }) => {
  return (
    <div>
      <h2>{board.title}</h2>
      <p>작성자: {board.writer}</p>
      <p>조회수: {board.viewCount}</p>
      <div>{board.content}</div>

      {/*해시태그*/}
      {board.hashtags && <HashtagList hashtags={board.hashtags} />}

      {/*이모지*/}
      <EmojiSelector boardId={board.id} />
    </div>
  );
};
export default BoardContent;
