const HashtagList = ({ hashtags }) => {
  if (!hashtags || hashtags.length === 0) return null;

  const tagArray = Array.isArray(hashtags)
    ? hashtags
    : hashtags.split(",").map((tag) => tag.trim());

  if (tagArray.length === 0) return null;
  return (
    <div>
      {tagArray.map((tag, idx) => (
        <span key={idx}>{tag}</span>
      ))}
    </div>
  );
};
export default HashtagList;
