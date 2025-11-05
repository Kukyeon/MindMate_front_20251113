const HashtagList = ({ hashtags }) => {
  if (!hashtags || hashtags.length === 0) return null;
  return (
    <div>
      {hashtags.map((tag, idx) => (
        <span key={idx}>{tag}</span>
      ))}
    </div>
  );
};
export default HashtagList;
